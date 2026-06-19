"""Web-search fallback for the tutor, used only when RAG finds nothing.

Tries Tavily first (if a key is configured), then falls back to DuckDuckGo's
no-key HTML endpoint. Returns a short list of {title, url, snippet} dicts; the
caller turns them into context. Best-effort: any failure yields an empty list so
the tutor degrades gracefully rather than erroring.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

import httpx

from ..config import get_settings


@dataclass
class WebResult:
    title: str
    url: str
    snippet: str


async def _tavily(query: str, key: str, k: int) -> list[WebResult]:
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(
            "https://api.tavily.com/search",
            json={
                "api_key": key,
                "query": query,
                "max_results": k,
                "search_depth": "basic",
                "include_answer": False,
            },
        )
        r.raise_for_status()
        data = r.json()
        out: list[WebResult] = []
        for item in data.get("results", [])[:k]:
            out.append(
                WebResult(
                    title=item.get("title", ""),
                    url=item.get("url", ""),
                    snippet=(item.get("content") or "").strip(),
                )
            )
        return out


_TAG = re.compile(r"<[^>]+>")
_RESULT = re.compile(
    r'<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>.*?'
    r'(?:class="result__snippet"[^>]*>(.*?)</a>)?',
    re.DOTALL,
)


def _clean(html: str) -> str:
    return _TAG.sub("", html).replace("&amp;", "&").replace("&#x27;", "'").strip()


async def _duckduckgo(query: str, k: int) -> list[WebResult]:
    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        r = await client.post(
            "https://html.duckduckgo.com/html/",
            data={"q": query},
            headers={"User-Agent": "Mozilla/5.0 (compatible; FinGuruTutor/1.0)"},
        )
        r.raise_for_status()
        out: list[WebResult] = []
        for m in _RESULT.finditer(r.text):
            url, title, snippet = m.group(1), _clean(m.group(2) or ""), _clean(m.group(3) or "")
            if not title:
                continue
            # DuckDuckGo wraps the real URL in a redirect; pull uddg= if present.
            mu = re.search(r"uddg=([^&]+)", url)
            if mu:
                from urllib.parse import unquote

                url = unquote(mu.group(1))
            out.append(WebResult(title=title, url=url, snippet=snippet))
            if len(out) >= k:
                break
        return out


async def web_search(query: str) -> list[WebResult]:
    s = get_settings()
    k = s.web_search_max_results
    try:
        if s.tavily_api_key:
            res = await _tavily(query, s.tavily_api_key, k)
            if res:
                return res
    except Exception:
        pass  # fall through to DDG
    try:
        return await _duckduckgo(query, k)
    except Exception:
        return []
