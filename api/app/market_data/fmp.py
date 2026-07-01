"""US quotes + light fundamentals enrichment via Financial Modeling Prep.

Only used for the current price (EDGAR/DART carry no live price) and, when
available, an analyst forward-growth estimate for a truer PEG. Uses FMP's new
`/stable` endpoints (the legacy `/api/v3` routes were retired Aug 2025). Cached.
"""
from __future__ import annotations

from ..config import get_settings
from .cache import cached, get_client

_BASE = "https://financialmodelingprep.com/stable"


def _key() -> str:
    k = get_settings().fmp_api_key
    if not k:
        raise RuntimeError("FMP_API_KEY is not configured")
    return k


async def quote(ticker: str) -> dict:
    """Current price + a few headline fields for a US ticker."""

    async def load() -> dict:
        r = await get_client().get(
            f"{_BASE}/quote", params={"symbol": ticker.upper(), "apikey": _key()}
        )
        r.raise_for_status()
        data = r.json()
        if not isinstance(data, list) or not data:
            raise LookupError(f"No FMP quote for {ticker}")
        q = data[0]
        return {
            "price": q.get("price"),
            "marketCap": q.get("marketCap"),
            "eps": q.get("eps"),
            "pe": q.get("pe"),
            "name": q.get("name"),
        }

    ttl = get_settings().market_data_cache_ttl
    # Prices move intraday; cache briefly (1h) rather than the 24h fundamentals TTL.
    return await cached(f"fmp:quote:{ticker.upper()}", min(ttl, 3600), load)
