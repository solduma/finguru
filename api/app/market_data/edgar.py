"""US fundamentals via SEC EDGAR's free XBRL companyfacts API.

No API key; a descriptive User-Agent is required and we stay well under the
10 req/sec courtesy limit (everything is cached 24h). We resolve ticker -> CIK
from SEC's published map, then pull companyfacts and reduce each us-gaap concept
to one value per fiscal year (annual 10-K frames, form 10-K, full-year period).
"""
from __future__ import annotations

from ..config import get_settings
from .cache import cached, get_client
from .schema import AnnualPoint, Fundamentals

_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"
_FACTS_URL = "https://data.sec.gov/api/xbrl/companyfacts/CIK{cik:010d}.json"

# Map our normalized fields to the candidate us-gaap concept tags, in priority
# order (first one present wins). Different filers use different revenue tags.
_CONCEPTS: dict[str, list[str]] = {
    "revenue": [
        "RevenueFromContractWithCustomerExcludingAssessedTax",
        "Revenues",
        "SalesRevenueNet",
    ],
    "netIncome": ["NetIncomeLoss"],
    "operatingIncome": ["OperatingIncomeLoss"],
    "eps": ["EarningsPerShareDiluted", "EarningsPerShareBasic"],
    "dividendsPerShare": [
        "CommonStockDividendsPerShareDeclared",
        "CommonStockDividendsPerShareCashPaid",
    ],
    "operatingCashFlow": ["NetCashProvidedByUsedInOperatingActivities"],
    "capex": ["PaymentsToAcquirePropertyPlantAndEquipment"],
    "dividendsPaid": [
        "PaymentsOfDividendsCommonStock",
        "PaymentsOfDividends",
        "DividendsCommonStockCash",
    ],
}
_SNAPSHOT: dict[str, list[str]] = {
    "totalAssets": ["Assets"],
    "totalLiabilities": ["Liabilities"],
    "totalEquity": ["StockholdersEquity"],
    "cash": ["CashAndCashEquivalentsAtCarryingValue"],
    "sharesOutstanding": [
        "CommonStockSharesOutstanding",
        "EntityCommonStockSharesOutstanding",
    ],
}


def _headers() -> dict[str, str]:
    return {"User-Agent": get_settings().sec_edgar_ua, "Accept-Encoding": "gzip"}


async def _ticker_map() -> dict[str, dict]:
    async def load() -> dict[str, dict]:
        r = await get_client().get(_TICKERS_URL, headers=_headers())
        r.raise_for_status()
        data = r.json()
        # keyed by arbitrary index -> {cik_str, ticker, title}
        return {row["ticker"].upper(): row for row in data.values()}

    # The map is large and stable; cache it for a day.
    return await cached("edgar:tickers", 86400, load)


def _fy_facts(facts: list[dict]) -> dict[int, float]:
    """Pick one value per fiscal year from FY 10-K facts."""
    by_year: dict[int, float] = {}
    for f in facts:
        if f.get("form") != "10-K" or f.get("fp") != "FY":
            continue
        fy = f.get("fy")
        val = f.get("val")
        if fy is None or val is None:
            continue
        by_year[int(fy)] = float(val)
    return by_year


def _annual_series(concept: dict | None) -> list[AnnualPoint]:
    """Reduce one companyfacts concept to one value per FY (10-K, full year).

    A concept can expose several units (e.g. DPS under both 'pure' and
    'USD/shares', only one of which is populated). Pick the unit that yields the
    most fiscal-year values rather than guessing by name.
    """
    if not concept:
        return []
    units = concept.get("units", {})
    best: dict[int, float] = {}
    for facts in units.values():
        by_year = _fy_facts(facts)
        if len(by_year) > len(best):
            best = by_year
    return [AnnualPoint(year=y, value=v) for y, v in sorted(best.items())]


async def fetch_us(ticker: str) -> Fundamentals:
    tmap = await _ticker_map()
    row = tmap.get(ticker.upper())
    if not row:
        raise LookupError(f"US ticker not found on SEC EDGAR: {ticker}")
    cik = int(row["cik_str"])

    settings = get_settings()

    async def load_facts() -> dict:
        url = _FACTS_URL.format(cik=cik)
        r = await get_client().get(url, headers=_headers())
        r.raise_for_status()
        return r.json()

    facts = await cached(
        f"edgar:facts:{cik}", settings.market_data_cache_ttl, load_facts
    )
    gaap = facts.get("facts", {}).get("us-gaap", {})

    def best_series(tags: list[str]) -> list[AnnualPoint]:
        # Try each candidate tag in priority order; use the first that yields a
        # usable FY series. A tag can exist but carry no 10-K data (e.g. KO tags
        # dividends under ...CashPaid, not ...Declared), so presence isn't enough.
        for t in tags:
            series = _annual_series(gaap.get(t))
            if series:
                return series
        return []

    fundamentals = Fundamentals(
        ticker=ticker.upper(),
        market="us",
        name=facts.get("entityName", row.get("title", ticker)),
        currency="USD",
    )
    for field, tags in _CONCEPTS.items():
        setattr(fundamentals, field, best_series(tags))
    for field, tags in _SNAPSHOT.items():
        series = best_series(tags)
        if series:
            setattr(fundamentals, field, series[-1].value)

    # Debt: long-term + short-term where present.
    lt = _annual_series(gaap.get("LongTermDebtNoncurrent"))
    st = _annual_series(gaap.get("LongTermDebtCurrent"))
    if lt or st:
        fundamentals.totalDebt = (lt[-1].value if lt else 0) + (
            st[-1].value if st else 0
        )

    fundamentals.sources = [
        {
            "label": "SEC EDGAR filings",
            "url": f"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik:010d}&type=10-K",
        }
    ]
    return fundamentals
