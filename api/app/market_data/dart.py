"""Korea fundamentals via OpenDART's free API.

Validated by the Mirae Asset "OpenProxy" report as the right KR disclosure
source. Flow: resolve stock code -> corp_code (from the published corpCode zip),
then pull the full single-company financial statements (fnlttSinglAcntAll) for a
couple of recent years and normalize by IFRS account_id (robust across issuers;
Korean account *names* vary, account_ids don't). Amounts are KRW.

Known pitfalls (per the report): financial-holding filers use a single-library
format that can defeat amount parsing; we surface what parses and leave the rest
absent rather than guessing.
"""
from __future__ import annotations

import io
import zipfile
import xml.etree.ElementTree as ET

from ..config import get_settings
from .cache import cached, get_client
from .schema import AnnualPoint, Fundamentals

_CORP_CODE_URL = "https://opendart.fss.or.kr/api/corpCode.xml"
_FIN_URL = "https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json"
_COMPANY_URL = "https://opendart.fss.or.kr/api/company.json"

# Map normalized fields to IFRS account_ids used in DART filings, with the
# statement(s) the value should be read from. An account_id like ProfitLoss
# appears in several statements (IS, CIS, CF, and multiple SCE rows including
# zeros), so we MUST scope by sj_div or the wrong row wins. IS = income stmt,
# CIS = comprehensive income, BS = balance sheet.
_ACCOUNT_IDS: dict[str, tuple[list[str], set[str]]] = {
    "revenue": (["ifrs-full_Revenue", "ifrs-full_RevenueFromContractsWithCustomers"], {"IS", "CIS"}),
    "netIncome": (["ifrs-full_ProfitLoss"], {"IS"}),
    "operatingIncome": (["dart_OperatingIncomeLoss"], {"IS", "CIS"}),
    "eps": (["ifrs-full_DilutedEarningsLossPerShare", "ifrs-full_BasicEarningsLossPerShare"], {"IS", "CIS"}),
}
_SNAPSHOT_IDS: dict[str, tuple[list[str], set[str]]] = {
    "totalAssets": (["ifrs-full_Assets"], {"BS"}),
    "totalLiabilities": (["ifrs-full_Liabilities"], {"BS"}),
    "totalEquity": (["ifrs-full_Equity", "ifrs-full_EquityAttributableToOwnersOfParent"], {"BS"}),
    "cash": (["ifrs-full_CashAndCashEquivalents"], {"BS"}),
}


def _key() -> str:
    k = get_settings().dart_api_key
    if not k:
        raise RuntimeError("DART_API_KEY is not configured")
    return k


async def _corp_code_map() -> dict[str, str]:
    """stock_code (6-digit) -> corp_code (8-digit)."""

    async def load() -> dict[str, str]:
        r = await get_client().get(_CORP_CODE_URL, params={"crtfc_key": _key()})
        r.raise_for_status()
        with zipfile.ZipFile(io.BytesIO(r.content)) as zf:
            xml = zf.read(zf.namelist()[0])
        root = ET.fromstring(xml)
        out: dict[str, str] = {}
        for node in root.iter("list"):
            stock = (node.findtext("stock_code") or "").strip()
            corp = (node.findtext("corp_code") or "").strip()
            if stock and corp:
                out[stock] = corp
        return out

    return await cached("dart:corpmap", 86400, load)


def _num(s: str | None) -> float | None:
    if not s:
        return None
    s = s.replace(",", "").strip()
    if not s or s == "-":
        return None
    try:
        return float(s)
    except ValueError:
        return None


async def _statements(corp_code: str, year: int) -> list[dict]:
    """Consolidated full-year statements for one fiscal year (reprt 11011)."""

    async def load() -> list[dict]:
        r = await get_client().get(
            _FIN_URL,
            params={
                "crtfc_key": _key(),
                "corp_code": corp_code,
                "bsns_year": str(year),
                "reprt_code": "11011",  # annual / business report
                "fs_div": "CFS",  # consolidated
            },
        )
        r.raise_for_status()
        data = r.json()
        return data.get("list", []) if data.get("status") == "000" else []

    ttl = get_settings().market_data_cache_ttl
    return await cached(f"dart:fin:{corp_code}:{year}", ttl, load)


async def fetch_kr(ticker: str, latest_year: int) -> Fundamentals:
    code = ticker.strip().zfill(6)
    cmap = await _corp_code_map()
    corp_code = cmap.get(code)
    if not corp_code:
        raise LookupError(f"KR ticker not found on OpenDART: {ticker}")

    # Two recent annual filings give ~4 distinct years (each carries 3).
    rows: list[dict] = []
    rcept_no = None
    for y in (latest_year, latest_year - 2):
        chunk = await _statements(corp_code, y)
        if chunk and rcept_no is None:
            rcept_no = chunk[0].get("rcept_no")
        rows.extend(chunk)

    f = Fundamentals(ticker=code, market="kr", name=ticker, currency="KRW")

    # company name (best-effort)
    try:
        cr = await get_client().get(
            _COMPANY_URL, params={"crtfc_key": _key(), "corp_code": corp_code}
        )
        if cr.is_success and cr.json().get("status") == "000":
            f.name = cr.json().get("corp_name", ticker)
    except Exception:
        pass

    def series_for(ids: list[str], statements: set[str]) -> list[AnnualPoint]:
        by_year: dict[int, float] = {}
        for row in rows:
            if row.get("account_id") not in ids:
                continue
            if row.get("sj_div") not in statements:
                continue
            base = int(row.get("bsns_year"))
            for col, off in (
                ("thstrm_amount", 0),
                ("frmtrm_amount", -1),
                ("bfefrmtrm_amount", -2),
            ):
                v = _num(row.get(col))
                # Don't let a 0 placeholder overwrite a real value for that year.
                if v is not None and (base + off not in by_year or v != 0):
                    by_year[base + off] = v
        return [AnnualPoint(year=y, value=v) for y, v in sorted(by_year.items())]

    for field, (ids, statements) in _ACCOUNT_IDS.items():
        setattr(f, field, series_for(ids, statements))
    for field, (ids, statements) in _SNAPSHOT_IDS.items():
        s = series_for(ids, statements)
        if s:
            setattr(f, field, s[-1].value)

    if rcept_no:
        f.sources = [
            {
                "label": "DART 전자공시 (원문)",
                "url": f"https://dart.fss.or.kr/dsaf001/main.do?rcpNo={rcept_no}",
            }
        ]
    return f
