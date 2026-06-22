#!/usr/bin/env python3
"""
安全清洗现有电竞 JSON，不重新爬取：
1. 去除 liquipediaPlayers.json 中选手 id/name 的 [e][h] 前缀。
2. 同步重命名 public/players/ 下被污染的照片文件，并更新 portrait 路径。
3. 把 liquipediaTeams.json 中的远程 logo URL 替换为已存在的本地文件路径。
4. 同步更新 team.players 中指向旧选手 id 的引用。

执行前会自动备份原 JSON。
"""

import json
import re
import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAYERS_JSON = ROOT / "lib" / "data" / "liquipediaPlayers.json"
TEAMS_JSON = ROOT / "lib" / "data" / "liquipediaTeams.json"
PLAYERS_DIR = ROOT / "public" / "players"
TEAMS_DIR = ROOT / "public" / "teams"

PREFIX = "[e][h]"


def slugify_team_name(name: str) -> str:
    """与 fetch_liquipedia_esports.py 保持一致的 slug 规则。"""
    s = re.sub(r"[()\[\]{}<>/\\|.,;:!?*\"'@#$%^&+=~`]+", "-", name)
    s = re.sub(r"[^\w\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af-]+", "-", s)
    s = re.sub(r"[-\s]+", "-", s).strip("-")
    s = "".join(c.lower() if c.isascii() and c.isalpha() else c for c in s)
    return s or "unknown"


def backup(path: Path) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest = path.with_suffix(f".json.{ts}.bak")
    shutil.copy2(path, dest)
    print(f"[backup] {path} -> {dest}")
    return dest


def clean_players() -> tuple[list[dict], dict[str, str]]:
    players = json.loads(PLAYERS_JSON.read_text(encoding="utf-8"))
    old_to_new: dict[str, str] = {}

    for p in players:
        old_id = p["id"]
        if old_id.startswith(PREFIX):
            new_id = old_id[len(PREFIX):]
            old_to_new[old_id] = new_id
            p["id"] = new_id
            p["name"] = new_id
            print(f"[player] {old_id} -> {new_id}")
        else:
            new_id = old_id

        # 同步修正 portrait 路径与文件
        portrait = p.get("portrait", "")
        old_slug = slugify_team_name(old_id)
        if portrait == f"/players/{old_slug}.png" and old_id.startswith(PREFIX):
            new_slug = slugify_team_name(new_id)
            p["portrait"] = f"/players/{new_slug}.png"
            old_file = PLAYERS_DIR / f"{old_slug}.png"
            new_file = PLAYERS_DIR / f"{new_slug}.png"
            if old_file.exists():
                if new_file.exists():
                    print(f"  [warn] target already exists, skip rename: {new_file}")
                else:
                    shutil.move(str(old_file), str(new_file))
                    print(f"  [rename] {old_file.name} -> {new_file.name}")

    return players, old_to_new


def clean_teams(old_to_new: dict[str, str]) -> list[dict]:
    teams = json.loads(TEAMS_JSON.read_text(encoding="utf-8"))

    existing_logos: dict[str, str] = {}
    for f in TEAMS_DIR.iterdir():
        if f.is_file():
            existing_logos[slugify_team_name(f.stem)] = f.name

    for t in teams:
        # 同步选手 id 引用
        if t.get("players"):
            t["players"] = [old_to_new.get(pid, pid) for pid in t["players"]]

        # 远程 logo 替换为本地文件
        logo = t.get("logo", "")
        if logo.startswith("http"):
            slug = slugify_team_name(t["name"])
            local_file = existing_logos.get(slug)
            if local_file:
                t["logo"] = f"/teams/{local_file}"
                print(f"[team logo] {t['name']}: {logo} -> /teams/{local_file}")
            else:
                print(f"[team logo] {t['name']}: no local file found, keep remote")

    return teams


def main() -> int:
    if not PLAYERS_JSON.exists() or not TEAMS_JSON.exists():
        print("JSON files not found")
        return 1

    backup(PLAYERS_JSON)
    backup(TEAMS_JSON)

    players, old_to_new = clean_players()
    teams = clean_teams(old_to_new)

    PLAYERS_JSON.write_text(json.dumps(players, ensure_ascii=False, indent=2), encoding="utf-8")
    TEAMS_JSON.write_text(json.dumps(teams, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\nWrote {PLAYERS_JSON} ({len(players)} players)")
    print(f"Wrote {TEAMS_JSON} ({len(teams)} teams)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
