#!/usr/bin/env python3
"""
为现有 liquipediaTeams.json 中没有赛区的战队，抓取 Liquipedia 战队页面
解析 Region 字段并更新 JSON。不重新跑完整爬虫，避免覆盖其他数据。
"""

import importlib.util
import json
import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEAMS_JSON = ROOT / "lib" / "data" / "liquipediaTeams.json"
TEAM_CACHE_DIR = ROOT / "scripts" / ".cache" / "liquipedia" / "teams"

# 加载主脚本中的函数，保持逻辑一致
spec = importlib.util.spec_from_file_location(
    "fetch_liquipedia_esports", ROOT / "scripts" / "fetch_liquipedia_esports.py"
)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

fetch_liquipedia_page = mod.fetch_liquipedia_page
parse_team_page = mod.parse_team_page
team_page_title = mod.team_page_title


def backup(path: Path) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest = path.with_suffix(f".json.{ts}.bak")
    shutil.copy2(path, dest)
    print(f"[backup] {path} -> {dest}")
    return dest


def main() -> int:
    teams = json.loads(TEAMS_JSON.read_text(encoding="utf-8"))
    backup(TEAMS_JSON)

    updated = 0
    skipped = 0
    failed = 0

    for t in teams:
        if t.get("region"):
            skipped += 1
            continue

        title = team_page_title(t["name"])
        html = fetch_liquipedia_page(
            title,
            TEAM_CACHE_DIR,
            refresh=False,
            retries=3,
            delay=2,
        )
        if not html:
            print(f"[no page] {t['name']}")
            failed += 1
            continue

        parsed = parse_team_page(html, fallback_name=t["name"])
        region = parsed.get("region")
        if region:
            t["region"] = region
            updated += 1
            print(f"[updated] {t['name']} -> {region}")
        else:
            print(f"[no region] {t['name']}")
            failed += 1

    TEAMS_JSON.write_text(json.dumps(teams, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nUpdated {updated}, skipped {skipped}, failed {failed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
