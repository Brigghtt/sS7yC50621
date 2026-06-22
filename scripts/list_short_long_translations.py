#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""列出当前 mapNameCnMap 中中文为 2 个字或 >=6 个字的条目。"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TS_PATH = ROOT / "lib" / "data" / "mapTranslations.ts"


def parse_map(ts_text: str) -> dict:
    pattern = re.compile(r"export const mapNameCnMap: Record<string, string> = \{(.*?)\};", re.S)
    m = pattern.search(ts_text)
    body = m.group(1)
    entries = {}
    for line in body.splitlines():
        line = line.strip()
        if not line or line.startswith("//"):
            continue
        mm = re.match(r'"([^"]+)":\s*"([^"]*)",?', line)
        if mm:
            entries[mm.group(1)] = mm.group(2)
    return entries


def main():
    entries = parse_map(TS_PATH.read_text(encoding="utf-8"))
    two = {k: v for k, v in entries.items() if len(v) == 2}
    long = {k: v for k, v in entries.items() if len(v) >= 6}

    print(f"=== 2 个字（共 {len(two)} 条）===")
    for k in sorted(two.keys(), key=str.lower):
        print(f'  "{k}": "{two[k]}",')

    print(f"\n=== >=6 个字（共 {len(long)} 条）===")
    for k in sorted(long.keys(), key=str.lower):
        print(f'  "{k}": "{long[k]}",')


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    main()
