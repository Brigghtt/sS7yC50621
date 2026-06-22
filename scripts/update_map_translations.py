#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
根据用户提供的地图中英文对照表 markdown，更新 lib/data/mapTranslations.ts 中的 mapNameCnMap。
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TS_PATH = ROOT / "lib" / "data" / "mapTranslations.ts"

# 从用户 markdown 中提取的英文 -> 中文 修正/补充表
# 仅包含与当前文件不同或当前文件缺失的条目。
CORRECTIONS = {
    # 1. 宝石争霸 (Gem Grab)
    "Deathcap Trap": "戈壁陷阱",
    "Undermine": "十面埋伏",
    "Rustic Arcade": "乡趣游乐场",
    "Double Swoosh": "嗖嗖作响",
    "Open Space": "开阔地带",
    "Lilygear Lake": "惊魂湖泊",
    "On a Roll": "连续成功",
    "Whisper Vale": "密语山谷",
    "ATLAS": "巨神之地",
    "Railroad Robbery": "铁路劫案",
    "Fortress Fall": "陷落堡垒",
    "Satomi Springs": "春意盎然",
    "Local Restaurants": "当地饭店",
    "Storage Sector": "仓库区",
    "Afterparty": "余兴派对",
    "Snake Pit": "混乱地带",
    "Picturesque": "优美风景",
    "Ancestral Roots": "原始根茎",
    "Treasure Island": "宝藏岛屿",

    # 2. 荒野决斗 (Showdown)
    "Skull Creek": "幽暗溪流",
    "Feast Or Famine": "饥荒盛宴",
    "Acid Lakes": "酸性毒沼",
    "Double Trouble": "坏事成双",
    "Waveform": "波浪形态",
    "Lilypond Grove": "林荫莲池",
    "Seeker": "探寻者",
    "Twisting Vines": "缠绕藤蔓",
    "Lotus": "莲花之境",
    "Makeshift Scaffolding": "简易支架",
    "Molten to the Core": "地心融解",
    "Crystal Eye Castle": "晶瞳城堡",
    "Truth": "唯一真理",
    "Kroker": "可乐饼干",
    "Gated Community": "封闭社区",
    "North Park Station": "北园车站",
    "Starfruit Supernova": "杨桃新星",

    # 3. 重装荒野决斗 (Loaded Showdown)
    "Cavern Churn": "洞穴迷宫",
    "Rockwall Brawl": "石墙林立",
    "Hot Maze": "灼热迷宫",

    # 4. 金库攻防 (Heist)
    "Kaboom Canyon": "轰隆峡谷",
    "Pit Stop": "维修站台",
    "Plain Text": "文本格式",
    "Zip Zap Zoom": "快如闪电",
    "All Things Wicked": "邪恶之境",
    "Aridity": "干旱地带",
    "Tuning Fork": "调音设备",
    "Eating Good!": "大快朵颐",
    "GG 2.0": "重制屋屋",
    "Subway Turfers": "地铁滑板",
    "Corner Cave": "边缘洞穴",
    "Photic Doom": "光影末日",
    "Quintillion": "天文数字",
    "Perpetual Motion": "永动机",

    # 5. 赏金猎人 (Bounty)
    "Shooting Star": "神秘流星",
    "Hideout": "草丛迷踪",
    "Dry Season": "酷热地带",
    "Don't turn around": "切勿转身",
    "Brace for Impact": "防御姿势",
    "Wall Hugging": "头撞南墙",
    "Watermelons": "西瓜成山",
    "Hit and Run": "肇事逃逸",
    "Layer Cake": "夹心蛋糕",
    "No Excuses": "责任自负",
    "Side by Side": "并肩作战",
    "Starburst": "星妙大爆炸",
    "Choral Chambers": "合唱大厅",

    # 6. 乱斗足球 (Brawl Ball)
    "Pinhole Punt": "精准射门",
    "Center Stage": "中心舞台",
    "Sunny Soccer": "阳光球场",
    "Rooftop Runners": "屋顶穿梭",
    "Spiraling Out": "盘旋而出",
    "Match 1123581321": "斐波纳契数列",
    "Grab the Moment": "抢占时机",
    "Nutmeg": "穿裆过人",
    "No Good Deed": "不怀好意",
    "Goaliestadium": "守门大师",
    "Pinball Dreams": "梦幻弹珠",
    "Sneaky Fields": "绿茵球场",
    "Beach Ball": "沙滩足球",
    "Priceless Cactus": "无价仙人掌",
    "Grass Knot": "草绳结",
    "Sidetrack": "偏离正轨",
    "Flute Chutes": "笛音通道",
    "Singed Earth": "焦黑大地",

    # 7. 5v5 乱斗足球 (Brawl Ball 5v5)
    "Siberian Stand Off": "寒冷对峙",
    "Pocket Pleasures": "口袋乐趣",

    # 8. 乱斗竞技场 (Brawl Arena)
    "Knockout Grounds": "决胜场地",
    "Crimson Divide": "赤红分划",
    "Kaiju Lake": "怪兽之湖",
    "The Smackdome": "爆裂擂台",
    "Silver Highlands": "白银高地",

    # 9. 热区争夺 (Hot Zone)
    "Open Business": "开门营业",
    "Ring of Fire": "灼热火圈",
    "Abracadabra": "神奇魔咒",
    "Playmaker": "主攻队员",
    "Back Shuffle": "倒步乱舞",
    "Ticket to Die": "绝命通行证",
    "The Seven Pillars of Humanity": "人生七柱",
    "Hyacinth House": "紫蓝房屋",
    "Belle's Rock": "贝尔之岩",
    "Dueling Beetles": "甲虫决斗",
    "Parallel Plays": "平行游戏",
    "Fishing Bed": "钓鱼基地",
    "In the Liminal": "临界点",
    "Just Another Race to Anywhere": "随处狂奔",
    "Zone Splitting": "区域分裂",
    "Tax Evasion": "避税区",
    "Golden Bay": "金色海湾",

    # 10. 乱斗淘汰赛 (Knockout)
    "Deep End": "深水区",
    "Flaring Phoenix": "烈焰凤凰",
    "New Perspective": "全新视角",
    "Healthy Middle Ground": "疗伤中场",
    "Four Levels": "四重关卡",
    "Double Decker": "双层甲板",
    "Think Ahead": "未雨绸缪",
    "Party for You": "专属派对",
    "Chivalry": "骑士精神",
    "Crab Claws": "困兽之斗",
    "Pinned Down": "螃蟹大螯",
    "Unhappy Arena": "愤怒竞技场",
    "Brawlverse": "乱斗宇宙",
    "Journey Of A Thousand Steps": "千步之旅",
    "Serpentine Island": "蛇灵岛屿",
    "Crescendo": "声势渐起",
    "Mastermind": "光栅大脑",
    "Out in the Open": "旷野荒野",
    "New Horizons": "新地平线",
    "Call of the Water": "水之召唤",
    "A Ballad About Minced Cutlets": "肉饼挽歌",
    "Komakoi": "口技舞台",
    "Please Remain Standing": "好戏开场",
    "Keep It Up": "保持站立",

    # 11. 乱斗篮球 (Basket Brawl)
    "Ball Hog": "首席球迷",
    "Pocket Pass": "口袋运球",
    "Triple-Double": "三双战绩",
    "Reversal": "反向传球",
    "Turnover": "控球失误",
    "Slam Dunk": "完美灌篮",

    # 12. 车轮擂台赛 (Duels)
    "No Surrender": "勇往直前",
    "Warrior's Way": "勇士之道",
    "Coin Flip": "抛硬币",
    "The Great Mighty Lou": "伟大小罗",
    "Jumpscare Lair": "骇人巢穴",
    "Monkey Maze": "猿猴迷阵",
    "Search and Destroy": "搜寻毁灭",
    "Paralysis Pen": "麻痹掩体",
    "Twentyfive to Two": "1点35",
    "Shrouding Serpent": "潜影巨蛇",
    # 注：Duels 中 "Flaring Phoenix" 与 Knockout 同名，mapNameCnMap 为单 key 映射，
    # 采用 markdown 中首次出现的 Knockout 翻译 "烈焰凤凰"，此处不再覆盖。

    # 13. 积分争夺赛 (Wipeout)
    "Time Flies": "时光飞逝",
    "Deathmatch": "殊死搏斗",
    "Wonderland": "梦幻乐园",
    "Too Gimmicky 2": "花样百出",
    "Palette Hangout": "画板聚会",
    "Slippery road": "滑溜道路",
    "Frosty tracks": "霜冻路径",
    "Island Of Finality": "终结之岛",
    "Pound of Mass": "巨力一击",
    "Catacombs": "骸骨地穴",
    "Walking On HOT SAND": "步行热沙",
    "Hello Always Ends With a Goodbye": "有始有终",
    "Attrition": "战斗减员",
    "Hee Hee": "嘻嘻哈哈",
    "Ice ice park": "冰雪公园",

    # 14. 乱斗冰球 (Brawl Hockey)
    "Slippery Slap": "滑溜击球",
    "Below Zero": "低温战场",
    "Star Garden": "星妙花园",
    "Cabin Fever": "冷藏盒子",
    "Arabesque": "藤蔓花纹",
    "Massive Meltdown": "冰雪消融",
    "Cold Snap": "强劲寒流",
    "H is for Holiday": "节日字母",
    "Tip Toe": "踮脚行动",
    "Snowcone Square": "雪顶广场",
    "Frostbite Rink": "极寒冰场",
    "Bouncy Bowl": "弹球赛事",
}


def parse_map(ts_text: str) -> dict:
    """解析 TS 文件中的 mapNameCnMap 对象，返回 {key: value}。"""
    pattern = re.compile(r"export const mapNameCnMap: Record<string, string> = \{(.*?)\};", re.S)
    m = pattern.search(ts_text)
    if not m:
        raise RuntimeError("无法在 mapTranslations.ts 中找到 mapNameCnMap")
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
    """按 key 字母排序生成 TS 对象体。"""
    lines = []
    for k in sorted(entries.keys(), key=str.lower):
        v = entries[k]
        # 对中文值中的双引号做转义（理论上没有）
        safe_v = v.replace('"', '\\"')
        lines.append(f'  "{k}": "{safe_v}",')
    # 去掉最后一行的逗号
    if lines:
        lines[-1] = lines[-1].rstrip(",")
    return "\n".join(lines)


def main():
    ts_text = TS_PATH.read_text(encoding="utf-8")
    entries = parse_map(ts_text)

    # 应用修正
    for en, cn in CORRECTIONS.items():
        entries[en] = cn

    # 清理与 markdown 指定 key 仅大小写/拼写变体重复的旧条目，
    # 避免 mapNameCnMap 中同时存在多个相似 key。
    obsolete_keys = {
        "Brawlerverse",          # 使用 "Brawlverse"
        "Gg 2.0",                # 使用 "GG 2.0"
        "H Is For Holiday",      # 使用 "H is for Holiday"
        "In The Liminal",        # 使用 "In the Liminal"
        "Just Another Race To Anywhere",  # 使用 "Just Another Race to Anywhere"
    }
    for k in obsolete_keys:
        entries.pop(k, None)

    # 二次润色：对仅 2 个字或 >=6 个字的翻译进行优化；
    # 若仍无法得到自然简洁（3~5 字）的译名，则从精确映射中移除，走兜底翻译。
    polish = {
        # 2 字 → 扩写
        "Cool Shapes": "酷炫图形",          # 原"酷形"太生硬
        "Hop Skip And Jump": "三级跳",      # 原"跳跃"丢失 triple-jump 含义
        "Jumping Beans": "墨西哥跳豆",      # 原"跳豆"过短
        "Layer Bake": "层层烘烤",           # 原"层烤"生硬
        # >=6 字 → 精简
        "Boom Town Bust": "轰隆镇陷落",     # 原"轰隆小镇破坏"拗口
        "Gargoyle Rt": "石像鬼大道",        # 原"石像鬼 RT"混杂英文
        "Juhas Test Chamber": "尤哈实验室", # 原"尤哈斯测试室"偏长
        "Match 1123581321": "斐氏数列",     # 原"斐波纳契数列"6字，缩为4字
    }
    for en, cn in polish.items():
        entries[en] = cn

    # 按用户要求：官方地图中文名一般在 3~5 个字之间。
    # 对无法落在该区间内的译名，先移除，走兜底翻译或显示英文原名。
    keys_to_remove = [
        en for en, cn in entries.items()
        if len(cn) == 2 or len(cn) >= 6
    ]
    for k in keys_to_remove:
        entries.pop(k, None)

    new_body = build_map_body(entries)
    new_text = re.sub(
        r"export const mapNameCnMap: Record<string, string> = \{.*?\};",
        "export const mapNameCnMap: Record<string, string> = {\n" + new_body + "\n};",
        ts_text,
        count=1,
        flags=re.S,
    )

    TS_PATH.write_text(new_text, encoding="utf-8")
    print(f"已更新 {TS_PATH}")
    print(f"当前 mapNameCnMap 共 {len(entries)} 条")


if __name__ == "__main__":
    main()
