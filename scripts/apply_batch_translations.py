#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
合并各子代理生成的翻译文件，校验后写入 lib/data/mapTranslations.ts。
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TS_PATH = ROOT / "lib" / "data" / "mapTranslations.ts"
GROUP_DIR = ROOT / "scripts" / "translation_groups"

OUTPUT_FILES = [
    "group1_showdown_out.json",
    "group2_brawlball_out.json",
    "group3_heist_bounty_out.json",
    "group4_hotzone_knockout_wipeout_out.json",
    "group5_duels_arena_pve_out.json",
    "group6_event_a_out.json",
    "group7_event_b_out.json",
]


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


def build_map_body(entries: dict) -> str:
    lines = []
    for k in sorted(entries.keys(), key=str.lower):
        v = entries[k]
        safe_v = v.replace('"', '\\"')
        lines.append(f'  "{k}": "{safe_v}",')
    if lines:
        lines[-1] = lines[-1].rstrip(",")
    return "\n".join(lines)


def is_pure_chinese(text: str) -> bool:
    # 允许中文字符（含常见标点），不允许 ASCII 字母/数字
    for ch in text:
        if ch.isascii() and ch.isalnum():
            return False
    return True


def main():
    ts_text = TS_PATH.read_text(encoding="utf-8")
    entries = parse_map(ts_text)

    new_translations = {}
    for fname in OUTPUT_FILES:
        fpath = GROUP_DIR / fname
        if not fpath.exists():
            print(f"警告：{fpath} 不存在，跳过")
            continue
        data = json.loads(fpath.read_text(encoding="utf-8"))
        new_translations.update(data)

    print(f"合并得到 {len(new_translations)} 条候选翻译")

    invalid = []
    for en, cn in new_translations.items():
        issues = []
        if len(cn) < 3 or len(cn) > 5:
            issues.append(f"长度 {len(cn)}")
        if not is_pure_chinese(cn):
            issues.append("含英文/数字")
        if issues:
            invalid.append((en, cn, issues))

    if invalid:
        print(f"发现 {len(invalid)} 条不符合规则的翻译：")
        for en, cn, issues in invalid:
            print(f'  "{en}": "{cn}" -> {", ".join(issues)}')
        # 过滤掉不合规的
        for en, cn, _ in invalid:
            del new_translations[en]
        print(f"过滤后剩余 {len(new_translations)} 条")

    # 应用翻译
    added = 0
    updated = 0
    for en, cn in new_translations.items():
        if en in entries:
            updated += 1
        else:
            added += 1
        entries[en] = cn

    # 再次校验整个 mapNameCnMap
    bad_in_map = [
        (k, v) for k, v in entries.items()
        if len(v) < 3 or len(v) > 5 or not is_pure_chinese(v)
    ]
    if bad_in_map:
        print(f"警告：mapNameCnMap 中仍有 {len(bad_in_map)} 条不符合 3~5 纯中文规则")
        for k, v in bad_in_map[:20]:
            print(f'  "{k}": "{v}"')

    new_body = build_map_body(entries)
    new_text = re.sub(
        r"export const mapNameCnMap: Record<string, string> = \{.*?\};",
        "export const mapNameCnMap: Record<string, string> = {\n" + new_body + "\n};",
        ts_text,
        count=1,
        flags=re.S,
    )

    TS_PATH.write_text(new_text, encoding="utf-8")
    print(f"\n已更新 {TS_PATH}")
    print(f"新增 {added} 条，更新 {updated} 条，当前共 {len(entries)} 条")


if __name__ == "__main__":
    main()
