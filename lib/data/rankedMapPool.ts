// lib/data/rankedMapPool.ts
// 当前赛季排位地图池静态数据。
// 来源：日服 2026-06-18 ~ 2026-07-15 赛季图片（Season 46）
// 地图名为 BrawlAPI / Brawlify 使用的英文官方原名，便于与全量地图接口匹配。

export interface RankedMapPool {
  season: string;
  period: string;
  region: string;
  source: string;
  pools: Record<string, string[]>;
  allMapNames: string[];
}

const pools: Record<string, string[]> = {
  // エメラルドハント / Gem Grab / 宝石争霸
  'Gem Grab': [
    'Hard Rock Mine',   // ごつごつ坑道
    'Double Swoosh',    // ダブルレール
    'Undermine',        // アンダーマイン
    'Gem Fort',         // エメラルドの要塞
  ],
  // ブロストライカー / Brawl Ball / 乱斗足球
  'Brawl Ball': [
    'Center Stage',     // 中央コート
    'Pinball Dreams',   // ピンボールドリーム
    'Sneaky Fields',    // 静かな広場
    'Triple Dribble',   // トリプル・ドリブル
  ],
  // 強奪 / Heist / 金库攻防
  'Heist': [
    'Hot Potato',       // ホットポテト
    'Safe Zone',        // 安全地帯
    'Kaboom Canyon',    // どんぱち谷
    'Bridge Too Far',   // 橋の彼方
    'Pit Stop',         // ピットストップ
    'Safe(r) Zone',     // 安全地帯・改
  ],
  // 賞金稼ぎ / Bounty / 赏金猎人
  'Bounty': [
    'Shooting Star',    // 流れ星
    'Hideout',          // 隠れ家
    'Dry Season',       // 乾燥地帯
    'Layer Cake',       // ミルフィーユ
  ],
  // ホットゾーン / Hot Zone / 热区争夺
  'Hot Zone': [
    'Dueling Beetles',  // ビートルバトル
    'Open Business',    // オープンビジネス
    'Parallel Plays',   // パラレルワールド
    'Ring of Fire',     // 炎のリング
  ],
  // ノックアウト / Knockout / 乱斗淘汰赛
  'Knockout': [
    "Belle's Rock",     // ベルの岩
    'Out in the Open',  // オープンフィールド
    'Flaring Phoenix',  // 燃える不死鳥
    'New Horizons',     // 新たなる地平
  ],
};

export const rankedMapPool: RankedMapPool = {
  season: 'Season 46',
  period: '2026/06/18 ~ 2026/07/15',
  region: '日服 / 国际服排位池',
  source: '官方赛季图片',
  pools,
  allMapNames: Array.from(new Set(Object.values(pools).flat())),
};
