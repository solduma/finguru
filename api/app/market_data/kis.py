"""Korea live prices via the KIS (한국투자증권) OpenAPI.

Two steps: OAuth client-credentials token (valid ~24h — cached so we don't
re-mint on every quote), then the domestic-stock current-price query. Returns a
normalized quote so the route doesn't branch on market.
"""
from __future__ import annotations

import time

from ..config import get_settings
from .cache import cached, get_client

# Module-level token cache (token lifetime ~24h; refresh with margin).
_token: str | None = None
_token_exp: float = 0.0


def _creds() -> tuple[str, str, str]:
    s = get_settings()
    if not s.kis_app_key or not s.kis_app_secret:
        raise RuntimeError("KIS_APP_KEY / KIS_APP_SECRET not configured")
    return s.kis_app_key, s.kis_app_secret, s.kis_base_url


async def _access_token() -> str:
    global _token, _token_exp
    if _token and time.monotonic() < _token_exp:
        return _token
    key, secret, base = _creds()
    r = await get_client().post(
        f"{base}/oauth2/tokenP",
        headers={"content-type": "application/json"},
        json={"grant_type": "client_credentials", "appkey": key, "appsecret": secret},
    )
    r.raise_for_status()
    data = r.json()
    _token = data["access_token"]
    # expires_in is seconds (~86400); refresh 5 min early.
    _token_exp = time.monotonic() + max(60, int(data.get("expires_in", 86400)) - 300)
    return _token


async def quote(ticker: str) -> dict:
    """Current price for a 6-digit KR stock code."""
    code = ticker.strip().zfill(6)

    async def load() -> dict:
        key, secret, base = _creds()
        token = await _access_token()
        r = await get_client().get(
            f"{base}/uapi/domestic-stock/v1/quotations/inquire-price",
            headers={
                "authorization": f"Bearer {token}",
                "appkey": key,
                "appsecret": secret,
                "tr_id": "FHKST01010100",
            },
            params={"FID_COND_MRKT_DIV_CODE": "J", "FID_INPUT_ISCD": code},
        )
        r.raise_for_status()
        data = r.json()
        if data.get("rt_cd") != "0":
            raise LookupError(f"KIS quote failed for {code}: {data.get('msg1')}")
        o = data.get("output", {})
        price = float(o["stck_prpr"]) if o.get("stck_prpr") else None
        return {
            "price": price,
            "pe": float(o["per"]) if o.get("per") else None,
            "eps": float(o["eps"]) if o.get("eps") else None,
        }

    # Quotes are live; short cache.
    return await cached(f"kis:quote:{code}", 300, load)
