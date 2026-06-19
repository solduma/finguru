"""Structural validator for Korean lessons vs the English source.

Run from repo root:  python3 scripts/validate_ko.py
Checks that each KO file preserves the EN structure (frontmatter keys that must
not change, chart/callout counts) and has no leaked harness tags or stray
untranslated headings. Reports issues; exits non-zero if any are found.
"""
from __future__ import annotations

import glob
import os
import re
import sys

EN = "web/content"
KO = "web/content/ko"

FIXED_KEYS = ("slug", "kind", "level", "order")


def frontmatter(text: str) -> dict:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    d = {}
    for line in text[3:end].strip().split("\n"):
        if ":" in line:
            k, _, v = line.partition(":")
            d[k.strip()] = v.strip()
    return d


def main() -> int:
    issues: list[str] = []
    ko_files = sorted(glob.glob(f"{KO}/**/*.mdx", recursive=True))
    if not ko_files:
        print("no KO files found")
        return 1

    for ko in ko_files:
        rel = os.path.relpath(ko, KO)
        en = os.path.join(EN, rel)
        if not os.path.exists(en):
            issues.append(f"{rel}: no English source")
            continue
        kt, et = open(ko).read(), open(en).read()
        kf, ef = frontmatter(kt), frontmatter(et)

        for key in FIXED_KEYS:
            if kf.get(key) != ef.get(key):
                issues.append(f"{rel}: frontmatter '{key}' differs ({kf.get(key)} vs EN {ef.get(key)})")

        if not re.search(r"[가-힣]", kf.get("title", "")):
            issues.append(f"{rel}: title not Korean: {kf.get('title','')[:40]}")

        if kt.count("<Callout") != kt.count("</Callout>"):
            issues.append(f"{rel}: Callout open/close imbalance")

        for tag in ("<Callout", "<LineChart", "<CandleChart"):
            if kt.count(tag) != et.count(tag):
                issues.append(f"{rel}: {tag} count {kt.count(tag)} vs EN {et.count(tag)}")

        if re.search(r"</(?:fixed_ko_mdx|ko_mdx|invoke|parameter)>", kt):
            issues.append(f"{rel}: leaked harness tag")

    if issues:
        print(f"VALIDATION FAILED — {len(issues)} issue(s):")
        for i in issues:
            print("  -", i)
        return 1
    print(f"VALIDATION OK — {len(ko_files)} KO files structurally match EN.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
