"""KR forward EPS consensus via Naver Finance (FnGuide-backed).

FMP gates KR estimates and KIS's consensus endpoint isn't enabled on our
account, so for a real Korean forward-PEG we read Naver's company snapshot,
which exposes analyst consensus with explicit (A)/(E) column markers:

    https://navercomp.wisereport.co.kr/company/c1010001.aspx?cmp_cd=<6-digit>

The 주요지표 table has an EPS row like "6,564원 (2025/12A) | 45,066원 (2026/12E)".
We return the (E)/(A) forward growth. This is unofficial HTML scraping, so the
parser fails SOFT to None — the client then falls back to historical-growth PEG.
"""
from __future__ import annotations

import re

from .cache import cached, get_client

_URL = "https://navercomp.wisereport.co.kr/company/c1010001.aspx"

# A very large consensus growth off a depressed trough (e.g. Samsung/Hynix
# rebounding +400-600% after the 2024-25 chip downcycle) is REAL, not a parse
# error — it just yields a very low PEG, which honestly signals "priced cheap
# vs. the expected rebound." So we keep it. We only reject non-positive growth
# (PEG undefined) and an absurd ceiling that almost certainly means a bad parse.
_MAX_GROWTH = 10.0  # +1000% — beyond this, suspect a parse error → fall back
_MIN_GROWTH = 0.0  # non-positive → PEG undefined, use historical instead


def _won(s: str) -> float | None:
    m = re.search(r"-?[\d,]+", s or "")
    if not m:
        return None
    try:
        return float(m.group(0).replace(",", ""))
    except ValueError:
        return None


async def forward_eps_growth(ticker: str) -> float | None:
    code = ticker.strip().zfill(6)

    async def load() -> float | None:
        try:
            r = await get_client().get(
                _URL,
                params={"cmp_cd": code},
                headers={
                    "User-Agent": "Mozilla/5.0",
                    "Referer": "https://finance.naver.com/",
                },
            )
            r.raise_for_status()
            html = r.text

            # Locate the 주요지표 table's header to learn which column is (A) vs (E),
            # then read the EPS row's two cells in the same order.
            rows = re.findall(r"<tr[^>]*>(.*?)</tr>", html, re.S)

            def cells(row: str) -> list[str]:
                return [
                    re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", c)).strip()
                    for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row, re.S)
                ]

            header_idx = None
            actual_col = est_col = None
            for i, row in enumerate(rows):
                c = cells(row)
                joined = " ".join(c)
                if "(E)" in joined and re.search(r"20\d\d/\d\d", joined):
                    # data cells are c[1:]; find which holds (A) and which (E)
                    for j, cell in enumerate(c[1:]):
                        if "(A)" in cell:
                            actual_col = j
                        elif "(E)" in cell:
                            est_col = j
                    header_idx = i
                    break
            if header_idx is None or est_col is None or actual_col is None:
                return None

            for row in rows[header_idx + 1 :]:
                c = cells(row)
                if c and c[0].strip().upper().startswith("EPS"):
                    data = c[1:]
                    if len(data) <= max(actual_col, est_col):
                        return None
                    actual = _won(data[actual_col])
                    est = _won(data[est_col])
                    if actual and est and actual > 0:
                        g = est / actual - 1
                        return g if _MIN_GROWTH <= g <= _MAX_GROWTH else None
                    return None
            return None
        except Exception:
            return None

    return await cached(f"naver:fwd:{code}", 86400, load)
