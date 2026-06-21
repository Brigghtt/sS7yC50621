#!/usr/bin/env python3
"""
从 Liquipedia Brawl Stars Wiki 抓取 2026 赛季赛事数据。
通过 Liquipedia MediaWiki API 直接获取页面 HTML，解析 bracket 比赛数据；
不再依赖 jina.ai reader，彻底规避其 429 限流。

用法：
    python scripts/fetch_liquipedia_esports.py
    python scripts/fetch_liquipedia_esports.py --refresh
    python scripts/fetch_liquipedia_esports.py --cache-only
    python scripts/fetch_liquipedia_esports.py --pages Chinese_Mainland/March/Monthly_Finals,Brawl_Cup
"""

import argparse
import gzip
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Any

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
CACHE_DIR = ROOT / "scripts" / ".cache" / "liquipedia"
OUT_JSON = ROOT / "lib" / "data" / "liquipediaTournaments.json"
HERO_DETAILS_TS = ROOT / "lib" / "data" / "heroDetails.ts"

# Liquipedia MediaWiki API endpoint
API_BASE = "https://liquipedia.net/brawlstars/api.php"
# Liquipedia 要求自定义 User-Agent 并遵守 API terms of use
LIQUIPEDIA_UA = "BrawlStarsWikiBot/1.0 (contact@example.com; personal project)"

# 并发 / 重试配置
DEFAULT_RETRIES = 3
DEFAULT_DELAY = 2  # Liquipedia API 建议不要过快，成功请求后休息 2 秒
MAX_RETRY_DELAY = 60

# 需要抓取的页面配置
PAGES: list[dict[str, Any]] = [
    {
        "path": "Brawl_Stars_Championship/2026/Season_1/East_Asia/Monthly_Finals",
        "region": "东亚",
        "category": "月赛",
        "month": "2026-02",
        "name_prefix": "2026 月赛 东亚赛区",
    },
    {
        "path": "Brawl_Stars_Championship/2026/Season_1/EMEA/Monthly_Finals",
        "region": "欧洲",
        "category": "月赛",
        "month": "2026-02",
        "name_prefix": "2026 月赛 欧洲赛区",
    },
    # 中国大陆赛区：2-6 月月赛 + 总决赛
    {
        "path": "Brawl_Stars_Championship/2026/Chinese_Mainland/February/Monthly_Finals",
        "region": "大陆",
        "category": "月赛",
        "month": "2026-02",
        "name_prefix": "2026 月赛 大陆赛区 二月",
    },
    {
        "path": "Brawl_Stars_Championship/2026/Chinese_Mainland/March/Monthly_Finals",
        "region": "大陆",
        "category": "月赛",
        "month": "2026-03",
        "name_prefix": "2026 月赛 大陆赛区 三月",
    },
    {
        "path": "Brawl_Stars_Championship/2026/Chinese_Mainland/April/Monthly_Finals",
        "region": "大陆",
        "category": "月赛",
        "month": "2026-04",
        "name_prefix": "2026 月赛 大陆赛区 四月",
    },
    {
        "path": "Brawl_Stars_Championship/2026/Chinese_Mainland/May/Monthly_Finals",
        "region": "大陆",
        "category": "月赛",
        "month": "2026-05",
        "name_prefix": "2026 月赛 大陆赛区 五月",
    },
    {
        "path": "Brawl_Stars_Championship/2026/Chinese_Mainland/June/Monthly_Finals",
        "region": "大陆",
        "category": "月赛",
        "month": "2026-06",
        "name_prefix": "2026 月赛 大陆赛区 六月",
    },
    {
        "path": "Brawl_Stars_Championship/2026/Chinese_Mainland/Finals",
        "region": "大陆",
        "category": "决赛",
        "month": "2026-08",
        "name_prefix": "2026 大陆赛区 总决赛",
    },
    {
        "path": "Brawl_Stars_Championship/2026/Brawl_Cup",
        "region": None,
        "category": "brawlcup",
        "month": "2026-05",
        "name_prefix": "2026 BrawlCup",
    },
]

MODE_MAP = {
    "Gem Grab": "宝石争霸",
    "Brawl Ball": "乱斗足球",
    "Bounty": "赏金猎人",
    "Heist": "金库攻防",
    "Hot Zone": "积分争夺赛",
    "Knockout": "乱斗淘汰赛",
    "Showdown": "荒野决斗",
    "Basket Brawl": "乱斗篮球",
    "Volley Brawl": "排球乱斗",
    "Trophy Thieves": "奖杯大盗",
    "Hold the Trophy": "夺杯飞逃",
    "Wipeout": "围歼",
    "Big Game": "首领之战",
    "Robo Rumble": "机甲入侵",
    "Siege": "机甲攻坚战",
    "Present Plunder": "礼物狂欢",
    "Duels": "车轮擂台赛",
}

ROUND_LABELS = {
    "quarter": "八强赛",
    "semi": "半决赛",
    "final": "总决赛",
    "elimination": "淘汰赛",
}


def build_hero_en_to_cn() -> dict[str, str]:
    """从 lib/data/heroDetails.ts 提取 enName -> name 映射。"""
    text = HERO_DETAILS_TS.read_text(encoding="utf-8")
    objects = re.findall(r'"\d+":\s*\{.*?\}(?=,\s*"\d+":|\s*\})', text, re.S)
    mapping: dict[str, str] = {}
    for obj in objects:
        name_m = re.search(r'"name":\s*"([^"]+)"', obj)
        en_m = re.search(r'"enName":\s*"([^"]+)"', obj)
        if name_m and en_m:
            mapping[en_m.group(1)] = name_m.group(1)
    return mapping


HERO_EN_TO_CN = build_hero_en_to_cn()


def _img_to_url(img) -> str:
    src = img.get("src", "")
    if src.startswith("/"):
        return f"https://liquipedia.net{src}"
    return src


def fetch_html(
    path: str,
    refresh: bool = False,
    retries: int = DEFAULT_RETRIES,
    delay: int = DEFAULT_DELAY,
) -> str | None:
    """通过 Liquipedia API 获取页面 HTML；优先读取缓存，失败时回退缓存。"""
    safe_name = path.replace("/", "_")
    cache_file = CACHE_DIR / f"{safe_name}.html"

    if not refresh and cache_file.exists() and cache_file.stat().st_size > 0:
        print(f"[cache] {path}")
        return cache_file.read_text(encoding="utf-8")

    title = path.replace("_", " ")
    url = f"{API_BASE}?action=parse&page={urllib.parse.quote(title)}&prop=text&format=json"

    last_exc: Exception | None = None
    for attempt in range(retries):
        print(f"[api] {path} (attempt {attempt + 1}/{retries})")
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": LIQUIPEDIA_UA,
                    "Accept-Encoding": "gzip",
                    "Accept": "application/json",
                },
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                raw = resp.read()
                if raw[:2] == b"\x1f\x8b":
                    data = gzip.decompress(raw).decode("utf-8", errors="replace")
                else:
                    data = raw.decode("utf-8", errors="replace")
            parsed = json.loads(data)
            html = parsed["parse"]["text"]["*"]
            CACHE_DIR.mkdir(parents=True, exist_ok=True)
            cache_file.write_text(html, encoding="utf-8")
            print(f"  -> ok, sleep {delay}s")
            time.sleep(delay)
            return html
        except Exception as exc:
            last_exc = exc
            print(f"  -> error: {exc}")
            wait = min(delay * (2**attempt) + 1, MAX_RETRY_DELAY)
            print(f"  -> retry in {wait}s")
            time.sleep(wait)

    if cache_file.exists() and cache_file.stat().st_size > 0:
        print(f"  -> fallback to cache after {retries} retries")
        return cache_file.read_text(encoding="utf-8")
    return None


def _extract_team_name(entry) -> str:
    """从 bracket opponent entry 提取战队名；优先用完整名称。"""
    # entry 自身的 aria-label 通常最完整（例如 "ABC (EA Team)"）
    aria = entry.get("aria-label")
    if aria:
        return aria
    name_el = entry.select_one(".team-name-dynamic")
    if name_el:
        for attr in ("data-team-name", "data-team-bracketname", "data-team-shortname"):
            v = name_el.get(attr)
            if v:
                return v
    a = entry.select_one(".name a")
    if a:
        return a.get_text(strip=True)
    return "Unknown"


def _extract_team_logo(entry) -> str:
    """从 bracket opponent entry 提取战队 logo URL。"""
    img = entry.select_one(".block-team img")
    if img:
        return _img_to_url(img)
    return ""


def _extract_score(entry) -> int | None:
    """从 bracket opponent entry 提取大比分。"""
    score_el = entry.select_one(".brkts-opponent-score-inner")
    if score_el:
        text = score_el.get_text(strip=True)
        m = re.search(r"\d+", text)
        if m:
            return int(m.group())
    return None


def _extract_datetime(match) -> datetime | None:
    """从 match popup 提取比赛时间（UTC）。"""
    timer = match.select_one(".timer-object")
    if timer:
        ts = timer.get("data-timestamp")
        if ts:
            try:
                return datetime.utcfromtimestamp(int(ts))
            except (ValueError, OSError):
                pass
        text = timer.get_text(strip=True)
        m = re.search(r"(\w+ \d+, \d{4}) - (\d{2}:\d{2})", text)
        if m:
            try:
                return datetime.strptime(m.group(1) + " " + m.group(2), "%B %d, %Y %H:%M")
            except ValueError:
                pass
    return None


MODE_SLUGS = {
    "Gem_Grab", "Brawl_Ball", "Bounty", "Heist", "Hot_Zone", "Knockout",
    "Showdown", "Basket_Brawl", "Volley_Brawl", "Trophy_Thieves",
    "Hold_the_Trophy", "Wipeout", "Big_Game", "Robo_Rumble", "Siege",
    "Present_Plunder", "Duels",
}


def _extract_game(game_el) -> dict[str, Any] | None:
    """从 popup 中的一局提取英雄、模式、地图、比分。"""
    sides = game_el.select(".brkts-popup-body-element-thumbs")
    if len(sides) < 2:
        return None
    left_imgs = sides[0].find_all("img")
    right_imgs = sides[1].find_all("img")
    left_heroes = [img.get("alt", "").strip() for img in left_imgs if img.get("alt")]
    right_heroes = [img.get("alt", "").strip() for img in right_imgs if img.get("alt")]

    # 比分：第一个 spaced 是左队，第三个是右队
    left_score: int | None = None
    right_score: int | None = None
    spaced = game_el.find_all("div", class_="brkts-popup-spaced")
    if len(spaced) >= 1:
        nums = re.findall(r"\b\d+\b", spaced[0].get_text(strip=True))
        if nums:
            left_score = int(nums[-1])
    if len(spaced) >= 3:
        nums = re.findall(r"\b\d+\b", spaced[2].get_text(strip=True))
        if nums:
            right_score = int(nums[-1])

    # 模式和地图
    mode: str | None = None
    map_name: str | None = None
    for a in game_el.find_all("a", href=True):
        href = a["href"].rstrip("/")
        text = a.get_text(strip=True)
        page = href.split("/")[-1]
        # 通过图片 src 识别模式图标
        img = a.find("img")
        if img and img.get("src") and "BSWiki_" in img["src"] and img["src"].endswith("_icon.png"):
            mode = page.replace("_", " ")
            continue
        # 通过页面 slug 识别模式
        if page in MODE_SLUGS:
            mode = text or page.replace("_", " ")
            continue
        # 其余 brawlstars 链接视为地图
        if href.startswith("/brawlstars/") and text and not text.startswith("File:"):
            map_name = text

    if not (mode and map_name and left_score is not None and right_score is not None):
        return None
    if len(left_heroes) < 1 or len(right_heroes) < 1:
        return None

    return {
        "teamA_heroes": left_heroes[:3],
        "teamB_heroes": right_heroes[:3],
        "teamA_score": left_score,
        "teamB_score": right_score,
        "mode": mode,
        "map": map_name,
    }


def parse_matches(html: str) -> list[dict[str, Any]]:
    """从 Liquipedia bracket HTML 解析比赛列表。"""
    soup = BeautifulSoup(html, "html.parser")
    matches: list[dict[str, Any]] = []
    for match in soup.find_all("div", class_="brkts-match"):
        entries = match.find_all("div", class_="brkts-opponent-entry")
        if len(entries) != 2:
            continue
        score_a = _extract_score(entries[0])
        score_b = _extract_score(entries[1])
        if score_a is None or score_b is None:
            continue
        winner = "A" if score_a > score_b else "B"
        dt = _extract_datetime(match)

        games: list[dict[str, Any]] = []
        popup = match.find("div", class_="brkts-popup")
        if popup:
            for game_el in popup.find_all("div", class_="brkts-popup-body-game"):
                g = _extract_game(game_el)
                if g:
                    games.append(g)

        matches.append(
            {
                "teamA": _extract_team_name(entries[0]),
                "teamB": _extract_team_name(entries[1]),
                "teamA_logo": _extract_team_logo(entries[0]),
                "teamB_logo": _extract_team_logo(entries[1]),
                "scoreA": score_a,
                "scoreB": score_b,
                "winner": winner,
                "datetime": dt.isoformat() if dt else None,
                "games": games,
            }
        )
    return matches


def assign_rounds(matches: list[dict[str, Any]]) -> list[str]:
    """按时间排序后，根据单淘汰赛场次数量分配轮次。"""
    sorted_matches = sorted(enumerate(matches), key=lambda x: x[1]["datetime"] or "")
    n = len(sorted_matches)
    labels = ["淘汰赛"] * n
    if n == 1:
        labels[sorted_matches[0][0]] = ROUND_LABELS["final"]
    elif n == 3:
        labels[sorted_matches[0][0]] = ROUND_LABELS["semi"]
        labels[sorted_matches[1][0]] = ROUND_LABELS["semi"]
        labels[sorted_matches[2][0]] = ROUND_LABELS["final"]
    elif n >= 7:
        for i, (orig_idx, _) in enumerate(sorted_matches):
            if i < n - 3:
                labels[orig_idx] = ROUND_LABELS["quarter"]
            elif i < n - 1:
                labels[orig_idx] = ROUND_LABELS["semi"]
            else:
                labels[orig_idx] = ROUND_LABELS["final"]
    return labels


def make_id(prefix: str, region_code: str, round_label: str, idx: int) -> str:
    round_code = {"八强赛": "qf", "半决赛": "sf", "总决赛": "final", "淘汰赛": "ko"}.get(
        round_label, "ko"
    )
    return f"{prefix}-{region_code}-{round_code}-{idx + 1}"


def translate_hero(name: str) -> str:
    return HERO_EN_TO_CN.get(name, name)


def translate_mode(name: str) -> str:
    return MODE_MAP.get(name, name)


def region_code(region: str | None) -> str:
    return {"东亚": "ea", "欧洲": "eu", "大陆": "cn"}.get(region or "", "gl")


def build_tournaments(matches: list[dict[str, Any]], cfg: dict[str, Any]) -> list[dict[str, Any]]:
    rounds = assign_rounds(matches)
    tournaments: list[dict[str, Any]] = []
    region = cfg["region"]
    prefix = cfg["name_prefix"]
    category = cfg["category"]
    month = cfg["month"]
    rcode = region_code(region)

    for idx, m in enumerate(matches):
        dt = datetime.fromisoformat(m["datetime"]) if m["datetime"] else None
        round_label = rounds[idx]
        tid = make_id(month.replace("-", ""), rcode, round_label, idx)
        games: list[dict[str, Any]] = []
        for g in m["games"]:
            team_a_win = g["teamA_score"] > g["teamB_score"]
            games.append(
                {
                    "map": g["map"],
                    "mode": translate_mode(g["mode"]),
                    "teamA": {
                        "heroes": [translate_hero(h) for h in g["teamA_heroes"][:3]],
                        "win": team_a_win,
                    },
                    "teamB": {
                        "heroes": [translate_hero(h) for h in g["teamB_heroes"][:3]],
                        "win": not team_a_win,
                    },
                }
            )

        tournaments.append(
            {
                "id": tid,
                "name": f"{prefix} {round_label}",
                "date": dt.strftime("%Y-%m-%d") if dt else month + "-01",
                "category": category,
                "subCategory": "淘汰赛",
                "eliminationRound": round_label if round_label != "淘汰赛" else None,
                "region": region,
                "format": "BO5",
                "version": "v59.000",
                "teamA": {
                    "name": m["teamA"],
                    "nameEn": m["teamA"],
                    "logo": m["teamA_logo"],
                },
                "teamB": {
                    "name": m["teamB"],
                    "nameEn": m["teamB"],
                    "logo": m["teamB_logo"],
                },
                "score": f"{m['scoreA']}:{m['scoreB']}",
                "winner": m["winner"],
                "matches": games,
            }
        )
    return tournaments


def build_schedules(tournaments: list[dict[str, Any]]) -> list[dict[str, Any]]:
    schedules = []
    for t in tournaments:
        dt = datetime.strptime(t["date"], "%Y-%m-%d")
        # 使用固定时间 20:00，原数据没有时间字段，赛程页面仅展示日期
        schedules.append(
            {
                "id": f"sch-{t['id']}",
                "date": t["date"],
                "time": "20:00",
                "tournamentName": t["name"],
                "teamA": t["teamA"]["name"],
                "teamB": t["teamB"]["name"],
                "category": t["category"],
                "region": t["region"],
                "month": t["date"][:7],
                "status": "ended",
            }
        )
    return schedules


def build_hero_stats_and_trends(tournaments: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    # 按月聚合
    month_picks: dict[str, dict[str, dict[str, Any]]] = {}
    month_map_picks: dict[str, dict[str, dict[str, int]]] = {}
    month_map_games: dict[str, dict[str, int]] = {}
    month_total_games: dict[str, int] = {}

    # 预加载 heroDetails 文本，避免循环内重复读取
    hero_details_text = HERO_DETAILS_TS.read_text(encoding="utf-8")

    for t in tournaments:
        month = t["date"][:7]
        if month not in month_picks:
            month_picks[month] = {}
            month_map_picks[month] = {}
            month_map_games[month] = {}
            month_total_games[month] = 0
        for g in t["matches"]:
            month_total_games[month] += 1
            map_name = g["map"]
            month_map_games[month][map_name] = month_map_games[month].get(map_name, 0) + 1
            for side in ("teamA", "teamB"):
                win = g[side]["win"]
                for h in g[side]["heroes"]:
                    h_en = None
                    for en, cn in HERO_EN_TO_CN.items():
                        if cn == h:
                            h_en = en
                            break
                    role = "战士"
                    if h_en:
                        m = re.search(
                            rf'"enName":\s*"{re.escape(h_en)}".*?"role":\s*"([^"]+)"',
                            hero_details_text,
                            re.S,
                        )
                        if m:
                            role = m.group(1)
                    d = month_picks[month].setdefault(
                        h,
                        {"pickCount": 0, "winCount": 0, "role": role},
                    )
                    d["pickCount"] += 1
                    if win:
                        d["winCount"] += 1
                    month_map_picks[month].setdefault(h, {}).setdefault(map_name, 0)
                    month_map_picks[month][h][map_name] += 1

    stats: list[dict[str, Any]] = []
    trends: list[dict[str, Any]] = []
    for month, heroes in month_picks.items():
        total_games = month_total_games[month]
        top = []
        for h, d in heroes.items():
            pick_rate = d["pickCount"] / total_games if total_games else 0
            win_rate = d["winCount"] / d["pickCount"] if d["pickCount"] else 0
            map_rates: dict[str, float] = {}
            for map_name, picks in month_map_picks[month].get(h, {}).items():
                games_on_map = month_map_games[month].get(map_name, 0)
                map_rates[map_name] = picks / games_on_map if games_on_map else 0
            stats.append(
                {
                    "heroId": h,
                    "month": month,
                    "role": d["role"],
                    "pickRate": round(pick_rate, 4),
                    "banRate": 0,
                    "winRate": round(win_rate, 4),
                    "pickCount": d["pickCount"],
                    "banCount": 0,
                    "matchCount": total_games,
                    "mapRates": map_rates,
                }
            )
            top.append({"heroId": h, "pickRate": round(pick_rate, 4), "banRate": 0})

        top.sort(key=lambda x: x["pickRate"], reverse=True)
        picked = set(heroes.keys())
        all_cn = set(HERO_EN_TO_CN.values())
        unused = sorted(all_cn - picked)
        trends.append(
            {
                "month": month,
                "topHeroes": top[:10],
                "unusedHeroes": unused,
            }
        )

    return stats, trends


def slugify_team_name(name: str) -> str:
    """把战队名转成可用的文件 slug；保留中文字符，英文统一小写。"""
    # 先替换常见特殊字符为空格/连字符
    s = re.sub(r"[()\[\]{}<>/\\|.,;:!?*\"'@#$%^&+=~`]+", "-", name)
    # 保留字母、数字、中文、日文假名、韩文以及已有连字符
    s = re.sub(r"[^\w\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af-]+", "-", s)
    # 合并连续连字符与空白
    s = re.sub(r"[-\s]+", "-", s).strip("-")
    # 仅对 ASCII 字母做小写，避免影响中文
    s = "".join(c.lower() if c.isascii() and c.isalpha() else c for c in s)
    return s or "unknown"


def download_team_logos(tournaments: list[dict[str, Any]]) -> None:
    """把战队 logo 下载到 public/teams/，并把 tournament 中的 logo 改为本地路径。"""
    teams_dir = ROOT / "public" / "teams"
    teams_dir.mkdir(parents=True, exist_ok=True)

    seen: set[str] = set()
    for t in tournaments:
        for side in ("teamA", "teamB"):
            team = t[side]
            src_url = team.get("logo", "")
            if not src_url or src_url.startswith("/teams/"):
                continue
            slug = slugify_team_name(team["name"])
            if slug in seen:
                team["logo"] = f"/teams/{slug}.png"
                continue
            seen.add(slug)
            ext = Path(src_url.split("?")[0]).suffix or ".png"
            dest = teams_dir / f"{slug}{ext}"
            try:
                req = urllib.request.Request(
                    src_url,
                    headers={
                        "User-Agent": LIQUIPEDIA_UA,
                        "Accept": "image/webp,image/apng,image/*,*/*",
                        "Referer": "https://liquipedia.net/",
                    },
                )
                with urllib.request.urlopen(req, timeout=30) as resp:
                    data = resp.read()
                dest.write_bytes(data)
                print(f"  -> logo {team['name']} -> {dest}")
                team["logo"] = f"/teams/{slug}{ext}"
                time.sleep(0.5)
            except Exception as exc:
                print(f"  -> logo download failed {team['name']}: {exc}")
                # 保留原 URL，至少还能显示


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--refresh", action="store_true", help="忽略缓存重新抓取")
    parser.add_argument(
        "--delay",
        type=int,
        default=DEFAULT_DELAY,
        help=f"成功请求后的等待秒数（默认 {DEFAULT_DELAY}）",
    )
    parser.add_argument(
        "--retries",
        type=int,
        default=DEFAULT_RETRIES,
        help=f"网络异常时的最大重试次数（默认 {DEFAULT_RETRIES}）",
    )
    parser.add_argument(
        "--cache-only",
        action="store_true",
        dest="cache_only",
        help="只使用本地缓存，不发起新请求",
    )
    parser.add_argument(
        "--pages",
        type=str,
        default="",
        help="逗号分隔的页面 path 过滤，例如 'Chinese_Mainland/February/Monthly_Finals,Brawl_Cup'",
    )
    args = parser.parse_args()

    pages = PAGES
    if args.pages:
        allowed = {p.strip() for p in args.pages.split(",")}
        pages = [cfg for cfg in PAGES if any(a in cfg["path"] for a in allowed)]
        if not pages:
            print(f"No pages matched filter: {args.pages}")
            return 1

    all_tournaments: list[dict[str, Any]] = []
    for cfg in pages:
        html = fetch_html(
            cfg["path"],
            refresh=args.refresh,
            retries=args.retries if not args.cache_only else 0,
            delay=args.delay,
        )
        if not html:
            print(f"  skipped {cfg['path']}")
            continue
        matches = parse_matches(html)
        print(f"  parsed {len(matches)} matches")
        if not matches:
            continue
        all_tournaments.extend(build_tournaments(matches, cfg))

    if not all_tournaments:
        print("No tournaments parsed. Exiting.")
        return 1

    download_team_logos(all_tournaments)

    schedules = build_schedules(all_tournaments)
    hero_stats, meta_trends = build_hero_stats_and_trends(all_tournaments)

    payload = {
        "tournaments": all_tournaments,
        "schedules": schedules,
        "heroTournamentStats": hero_stats,
        "metaTrends": meta_trends,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_JSON} ({len(all_tournaments)} tournaments)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
