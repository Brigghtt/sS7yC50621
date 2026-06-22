#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
为 brawlapi_maps.json 中缺失中文译名的 Gem Grab 地图补充 3~5 字译名。
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TS_PATH = ROOT / "lib" / "data" / "mapTranslations.ts"
API_PATH = ROOT / "brawlapi_maps.json"

# 为缺失的 Gem Grab 地图提供的中文译名（按 3~5 字规则）
GEM_GRAB_TRANSLATIONS = {
    "Acute Angle": "锐角地带",
    "Ahead Of The Curve": "弯道领先",
    "Arene En Folie": "疯狂竞技场",
    "Bear Trap": "熊陷阱",
    "Chill Space": "清凉空间",
    "Close Call": "千钧一发",
    "Corkscrew": "开瓶器",
    "Cotton Candy Dreams": "棉花糖梦境",
    "Cross Cut": "交叉切割",
    "Diamond Dust": "钻石星尘",
    "Duality": "二元之地",
    "Escape Velocity": "逃逸速度",
    "Excellent Escapade": "卓越冒险",
    "Flooded Dam": "淹没水坝",
    "Forest Clearing": "林间空地",
    "Four Doors": "四门之地",
    "Gem Bash": "宝石猛击",
    "Gem Exchange": "宝石交换",
    "Gem Source": "宝石之源",
    "Gift Wrap": "礼物包装",
    "Glass Half Full": "半满之杯",
    "Green Deck": "绿色甲板",
    "Last Stop": "最后一站",
    "Merch Fort": "商品要塞",
    "Molasses": "糖浆之地",
    "Opposing Forts": "对立要塞",
    "Pierced": "穿刺之地",
    "Pineapple Plaza": "菠萝广场",
    "Portal Overload": "传送门过载",
    "Red Herring": "红鲱鱼",
    "Royal Flush": "皇家同花顺",
    "Secret Surprise": "秘密惊喜",
    "Shabby Shells": "破旧贝壳",
    "Snake Shop": "蛇形商店",
    "Sneaky Sneak": "鬼鬼祟祟",
    "Snow Fort": "冰雪堡垒",
    "Snowball Fight": "雪球大战",
    "Snowy Siege": "雪地围攻",
    "Solid Center": "坚固中心",
    "Spruce Up": "焕然一新",
    "Stacking": "堆叠之地",
    "Stardust Storm": "星尘风暴",
    "Stay In Your Lane": "各行其道",
    "Stock Crash": "股市崩盘",
    "Swirling Storm": "漩涡风暴",
    "The Cooler Hard Rock": "清凉硬石",
    "Time Out": "暂停时刻",
    "Twisted Torpedo": "扭曲鱼雷",
    "Warehouse": "仓库重地",
}


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


def main():
    ts_text = TS_PATH.read_text(encoding="utf-8")
    entries = parse_map(ts_text)

    # 读取 API 中所有 Gem Grab 地图
    api_data = json.loads(API_PATH.read_text(encoding="utf-8"))
    gem_grab_names = {
        m["name"]
        for m in api_data.get("list", [])
        if m.get("gameMode", {}).get("name") == "Gem Grab"
    }

    added = 0
    updated = 0
    for en, cn in GEM_GRAB_TRANSLATIONS.items():
        if en not in gem_grab_names:
            print(f"警告：{en} 不在 API 的 Gem Grab 地图列表中，跳过")
            continue
        if en in entries:
            updated += 1
        else:
            added += 1
        entries[en] = cn

    new_body = build_map_body(entries)
    new_text = re.sub(
        r"export const mapNameCnMap: Record<string, string> = \{.*?\};",
        "export const mapNameCnMap: Record<string, string> = {\n" + new_body + "\n};",
        ts_text,
        count=1,
        flags=re.S,
    )

    TS_PATH.write_text(new_text, encoding="utf-8")
    print(f"Gem Grab 译名补充完成：新增 {added} 条，更新 {updated} 条")
    print(f"当前 mapNameCnMap 共 {len(entries)} 条")


if __name__ == "__main__":
    main()
