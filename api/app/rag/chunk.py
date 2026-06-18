"""Parse MDX lessons and split them into heading-aware chunks.

Each lesson is the same file the website renders, so the tutor's knowledge and
the reader's lessons can never drift apart. We keep section headings with their
text so retrieved chunks carry context (and a citable section).
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

import frontmatter


@dataclass
class Chunk:
    text: str
    lesson_slug: str
    lesson_title: str
    kind: str  # "guru" | "indicator"
    section: str  # nearest heading
    chunk_index: int


# Rough word budget per chunk; sections longer than this are split on paragraphs.
_MAX_WORDS = 320
_HEADING_RE = re.compile(r"^(#{1,4})\s+(.*)$")
# Drop the custom <Callout ...> / </Callout> tags but keep their inner text.
_CALLOUT_OPEN_RE = re.compile(r"<Callout[^>]*>")
_CALLOUT_CLOSE_RE = re.compile(r"</Callout>")


def _clean(text: str) -> str:
    text = _CALLOUT_OPEN_RE.sub("", text)
    text = _CALLOUT_CLOSE_RE.sub("", text)
    return text.strip()


def _split_long(text: str, max_words: int) -> list[str]:
    """Split an over-long section on paragraph boundaries."""
    paras = [p.strip() for p in text.split("\n\n") if p.strip()]
    out: list[str] = []
    buf: list[str] = []
    count = 0
    for p in paras:
        w = len(p.split())
        if count + w > max_words and buf:
            out.append("\n\n".join(buf))
            buf, count = [], 0
        buf.append(p)
        count += w
    if buf:
        out.append("\n\n".join(buf))
    return out


def chunk_file(path: Path) -> list[Chunk]:
    post = frontmatter.load(path)
    fm = post.metadata
    slug = fm.get("slug", path.stem)
    title = fm.get("title", path.stem)
    kind = fm.get("kind", "indicator")

    lines = post.content.splitlines()
    chunks: list[Chunk] = []
    current_section = title
    buf: list[str] = []

    def flush() -> None:
        nonlocal buf
        body = _clean("\n".join(buf))
        if body:
            for piece in _split_long(body, _MAX_WORDS):
                # Prefix the section so the embedding captures context.
                text = f"# {title} — {current_section}\n\n{piece}"
                chunks.append(
                    Chunk(
                        text=text,
                        lesson_slug=slug,
                        lesson_title=title,
                        kind=kind,
                        section=current_section,
                        chunk_index=len(chunks),
                    )
                )
        buf = []

    for line in lines:
        m = _HEADING_RE.match(line)
        if m:
            flush()
            current_section = m.group(2).strip()
        else:
            buf.append(line)
    flush()
    return chunks


def chunk_dir(content_dir: Path) -> list[Chunk]:
    chunks: list[Chunk] = []
    for sub in ("gurus", "indicators"):
        d = content_dir / sub
        if not d.exists():
            continue
        for f in sorted(d.glob("*.mdx")):
            chunks.extend(chunk_file(f))
    return chunks
