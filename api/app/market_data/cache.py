"""A tiny in-process async TTL cache + shared httpx client.

Fundamentals change quarterly, so a long TTL (default 24h) keeps us well within
upstream rate limits and makes the second lookup of any ticker instant. Keyed by
an arbitrary string; values are whatever the loader returns.
"""
from __future__ import annotations

import asyncio
import time
from collections.abc import Awaitable, Callable
from typing import Any

import httpx

_cache: dict[str, tuple[float, Any]] = {}
_locks: dict[str, asyncio.Lock] = {}

_client: httpx.AsyncClient | None = None


def get_client() -> httpx.AsyncClient:
    """One shared async client (connection pooling) for all providers."""
    global _client
    if _client is None:
        _client = httpx.AsyncClient(timeout=30.0, follow_redirects=True)
    return _client


async def cached(
    key: str, ttl: int, loader: Callable[[], Awaitable[Any]]
) -> Any:
    """Return cached value for `key`, else await `loader()` and store it.

    A per-key lock prevents a thundering herd from fetching the same ticker
    concurrently on a cold cache.
    """
    now = time.monotonic()
    hit = _cache.get(key)
    if hit and now - hit[0] < ttl:
        return hit[1]

    lock = _locks.setdefault(key, asyncio.Lock())
    async with lock:
        # Re-check: another waiter may have populated it while we blocked.
        hit = _cache.get(key)
        if hit and time.monotonic() - hit[0] < ttl:
            return hit[1]
        value = await loader()
        _cache[key] = (time.monotonic(), value)
        return value
