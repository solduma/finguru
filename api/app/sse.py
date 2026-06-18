"""Helpers for formatting Server-Sent Events.

We use named events so the frontend can distinguish token deltas, citations,
and the terminal 'done' signal on a single stream.
"""
from __future__ import annotations

import json
from typing import Any


def sse_event(event: str, data: Any) -> str:
    payload = data if isinstance(data, str) else json.dumps(data, ensure_ascii=False)
    return f"event: {event}\ndata: {payload}\n\n"
