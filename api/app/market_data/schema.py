"""The normalized fundamentals shape returned to the web client.

Both data sources (SEC EDGAR for the US, OpenDART for Korea) are flattened into
this one structure so the client-side compute layer (web/lib/fundamentals.ts)
and CompanyLab never branch on market. All money is in the issuer's reporting
currency (USD / KRW); `currency` says which.
"""
from __future__ import annotations

from pydantic import BaseModel


class AnnualPoint(BaseModel):
    """One fiscal year of a single line item."""

    year: int
    value: float


class Fundamentals(BaseModel):
    ticker: str
    market: str  # "us" | "kr"
    name: str
    currency: str  # "USD" | "KRW"

    # Per-year series (most recent last). Missing items are simply absent/short.
    revenue: list[AnnualPoint] = []
    netIncome: list[AnnualPoint] = []
    operatingIncome: list[AnnualPoint] = []  # ~EBIT
    eps: list[AnnualPoint] = []  # diluted
    dividendsPerShare: list[AnnualPoint] = []
    operatingCashFlow: list[AnnualPoint] = []
    capex: list[AnnualPoint] = []
    dividendsPaid: list[AnnualPoint] = []

    # Latest balance-sheet snapshots.
    totalAssets: float | None = None
    totalLiabilities: float | None = None
    totalEquity: float | None = None
    cash: float | None = None
    totalDebt: float | None = None
    sharesOutstanding: float | None = None

    # Forward EPS growth (decimal) from analyst estimates, when available (US via
    # FMP). Null for markets without a free consensus feed (e.g. KR) — the client
    # then falls back to historical EPS-growth PEG and labels it as such.
    forwardEpsGrowth: float | None = None

    # Provenance: the primary-source filing link(s), so the learner can verify
    # (the OpenProxy / honesty-thread principle). 1-3 entries.
    sources: list[dict] = []
