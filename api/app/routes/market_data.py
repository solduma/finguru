"""GET /market-data/fundamentals — normalized company fundamentals.

Backs the practical-module Company Analyzer (L2). One endpoint, two providers:
SEC EDGAR for US tickers, OpenDART for Korean ones. Everything is cached (24h
default) so repeat lookups are instant and we stay within upstream rate limits.
The response is the normalized `Fundamentals` shape; the client (lib/fundamentals.ts)
does all the ratio/DCF/scorecard math.
"""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Query

from ..market_data import dart, edgar, fmp, kis
from ..market_data.schema import Fundamentals

router = APIRouter(prefix="/market-data", tags=["market-data"])


@router.get("/quote")
async def quote(
    ticker: str = Query(..., min_length=1, max_length=12),
    market: str = Query("us", pattern="^(us|kr)$"),
) -> dict:
    """Current price (+ a few headline fields) — US via FMP, KR via KIS."""
    try:
        q = await (kis.quote(ticker) if market == "kr" else fmp.quote(ticker))
        return {"ticker": ticker.upper(), "market": market, **q}
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Quote error: {e}") from e


@router.get("/fundamentals", response_model=Fundamentals)
async def fundamentals(
    ticker: str = Query(..., min_length=1, max_length=12),
    market: str = Query("us", pattern="^(us|kr)$"),
) -> Fundamentals:
    try:
        if market == "kr":
            # KR filings lag; the most recent completed fiscal year is last year.
            latest_year = datetime.now(timezone.utc).year - 1
            return await dart.fetch_kr(ticker, latest_year)
        f = await edgar.fetch_us(ticker)
        # Enrich US names with analyst-consensus forward EPS growth for a true
        # forward-PEG (best-effort; leaves the field null if FMP has nothing).
        try:
            f.forwardEpsGrowth = await fmp.forward_eps_growth(ticker)
        except Exception:
            pass
        return f
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except RuntimeError as e:  # e.g. missing API key
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:  # upstream failure
        raise HTTPException(
            status_code=502, detail=f"Upstream data error: {e}"
        ) from e
