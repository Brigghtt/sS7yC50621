// ============================================================
// 电竞模块统一数据层 — 扩展版
// ============================================================

// -------------------- 1. 导航菜单 --------------------
export interface NavMenu {
  name: string;
  path: string;
}

export const navMenus: NavMenu[] = [
  { name: '首页', path: '/' },
  { name: '英雄图鉴', path: '/#hero' },
  { name: '游戏模式', path: '/#mode' },
  { name: '对战地图', path: '/#map' },
  { name: '赛事中心', path: '/events' },
];

// -------------------- 2. 英雄列表 --------------------
export interface Hero {
  id: string;
  name: string;
  image: string;
  role: string;
}

export const heroList: Hero[] = [
  { id: '1', name: '雪莉', image: '/HeroAvatars/xueli.png', role: '战士' },
  { id: '2', name: '柯尔特', image: '/HeroAvatars/keerte.png', role: '射手' },
  { id: '3', name: '杰西', image: '/HeroAvatars/jiexi.png', role: '辅助' },
  { id: '4', name: '公牛', image: '/HeroAvatars/gongniu.png', role: '坦克' },
  { id: '5', name: '布洛克', image: '/HeroAvatars/buluoke.png', role: '射手' },
  { id: '6', name: '迪克', image: '/HeroAvatars/dike.png', role: '投弹手' },
  { id: '7', name: '8比特', image: '/HeroAvatars/8bit.png', role: '射手' },
  { id: '8', name: '艾魅', image: '/HeroAvatars/aimei.png', role: '辅助' },
  { id: '9', name: '巴利', image: '/HeroAvatars/bali.png', role: '投弹手' },
  { id: '10', name: '波克', image: '/HeroAvatars/boke.png', role: '辅助' },
  { id: '11', name: '罗莎', image: '/HeroAvatars/luosha.png', role: '坦克' },
  { id: '12', name: '爆破麦克', image: '/HeroAvatars/mike.png', role: '投弹手' },
  { id: '13', name: '妮塔', image: '/HeroAvatars/nita.png', role: '战士' },
  { id: '14', name: '潘妮', image: '/HeroAvatars/panni.png', role: '射手' },
  { id: '15', name: '佩佩', image: '/HeroAvatars/peipei.png', role: '辅助' },
  { id: '16', name: '瑞克', image: '/HeroAvatars/ruike.png', role: '战士' },
  { id: '17', name: '斯派克', image: '/HeroAvatars/spike.png', role: '战士' },
  { id: '18', name: '阿渤', image: '/HeroAvatars/abo.png', role: '战士' },
  { id: '19', name: '艾尔·普里莫', image: '/HeroAvatars/aier.png', role: '坦克' },
  { id: '20', name: '达里尔', image: '/HeroAvatars/darier.png', role: '射手' },
  { id: '21', name: '卡尔', image: '/HeroAvatars/kael.png', role: '射手' },
  { id: '22', name: '雅琪', image: '/HeroAvatars/yaqi.png', role: '战士' },
  { id: '23', name: '帕姆', image: '/HeroAvatars/pam.png', role: '射手' },
  { id: '24', name: '费兰肯', image: '/HeroAvatars/ferank.png', role: '战士' },
  { id: '25', name: '比比', image: '/HeroAvatars/bibi.png', role: '战士' },
  { id: '26', name: '贝亚', image: '/HeroAvatars/beia.png', role: '射手' },
  { id: '27', name: '墨提斯', image: '/HeroAvatars/metis.png', role: '射手' },
  { id: '28', name: '塔拉', image: '/HeroAvatars/tala.png', role: '射手' },
  { id: '29', name: '吉恩', image: '/HeroAvatars/jien.png', role: '战士' },
  { id: '30', name: '麦克斯', image: '/HeroAvatars/max.png', role: '坦克' },
  { id: '31', name: 'P先生', image: '/HeroAvatars/P.png', role: '辅助' },
  { id: '32', name: '芽芽', image: '/HeroAvatars/yy.png', role: '坦克' },
  { id: '33', name: '黑鸦', image: '/HeroAvatars/heiya.png', role: '坦克' },
  { id: '34', name: '里昂', image: '/HeroAvatars/leon.png', role: '坦克' },
  { id: '35', name: '沙迪', image: '/HeroAvatars/sadi.png', role: '射手' },
  { id: '36', name: '格尔', image: '/HeroAvatars/ger.png', role: '战士' },
];

// -------------------- 3. 赛事档案（新版） --------------------
export type TournamentCategory = 'LCQ' | '全球总决赛' | 'brawlcup' | '月赛';
export type TournamentRegion = '欧洲' | '东亚' | '大陆';
export type EliminationRound = '八强赛' | '四强赛' | '半决赛' | '总决赛';
export type SubCategory = '小组赛' | '淘汰赛';

export interface MatchGame {
  map: string;
  mode: string;
  teamA: { heroes: string[]; win: boolean };
  teamB: { heroes: string[]; win: boolean };
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  category: TournamentCategory;
  subCategory: SubCategory;
  eliminationRound: EliminationRound | null;
  region: TournamentRegion | null;
  format: string;
  version: string;
  teamA: { name: string; nameEn: string; logo: string };
  teamB: { name: string; nameEn: string; logo: string };
  score: string;
  winner: 'A' | 'B';
  matches: MatchGame[];
  videoUrl?: string;
}

import liquipediaData from './liquipediaTournaments.json';

export const tournaments: Tournament[] = liquipediaData.tournaments as unknown as Tournament[];

// -------------------- 4. 战队（新增赛区字段） --------------------
export interface Team {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  region: TournamentRegion;
  founded: string;
  style: string[];
  history: { event: string; result: string; date: string }[];
  players: string[];
  stats: { totalKills: number; avgDamage: number; winRate: number };
}

export const teams: Team[] = [
  {
    id: 'zeta',
    name: 'ZETA DIVISION',
    nameEn: 'ZETA DIVISION',
    logo: '/teams/zeta-division.png',
    region: '东亚',
    founded: '2021',
    style: ['擅长乱斗足球', '偏好双射手体系', '快节奏推进'],
    history: [
      { event: '2025 BSC 全球总决赛', result: '冠军', date: '2025-11' },
      { event: '2025 月赛 东亚赛区', result: '冠军', date: '2025-06' },
    ],
    players: ['zeta-achapi', 'zeta-sitetampo', 'zeta-mameshi'],
    stats: { totalKills: 1248, avgDamage: 18500, winRate: 0.72 },
  },
  {
    id: 'stmn',
    name: 'STMN Esports',
    nameEn: 'STMN Esports',
    logo: '/teams/stmn.png',
    region: '欧洲',
    founded: '2020',
    style: ['擅长宝石争霸', '稳健控图', '后期发力'],
    history: [
      { event: '2025 BSC 全球总决赛', result: '亚军', date: '2025-11' },
      { event: '2025 LCQ 欧洲赛区', result: '亚军', date: '2025-09' },
    ],
    players: ['stmn-tensai', 'stmn-bobby', 'stmn-moya'],
    stats: { totalKills: 1156, avgDamage: 17200, winRate: 0.68 },
  },
  {
    id: 'nova-cn',
    name: 'Nova China',
    nameEn: 'Nova China',
    logo: '/teams/nova.png',
    region: '大陆',
    founded: '2022',
    style: ['擅长乱斗足球', '近战突脸', '国服霸主'],
    history: [
      { event: '2025 BrawlCup 大陆赛区', result: '冠军', date: '2025-07' },
      { event: '2025 月赛 大陆赛区', result: '冠军', date: '2025-05' },
    ],
    players: ['nova-xiaoming', 'nova-dawei', 'nova-lei'],
    stats: { totalKills: 980, avgDamage: 16000, winRate: 0.65 },
  },
  {
    id: 'tig',
    name: 'TIG',
    nameEn: 'TIG',
    logo: '/teams/tig.png',
    region: '大陆',
    founded: '2023',
    style: ['擅长赏金猎人', '远程消耗', '阵地战'],
    history: [
      { event: '2025 BrawlCup 大陆赛区', result: '亚军', date: '2025-07' },
      { event: '2025 月赛 大陆赛区', result: '亚军', date: '2025-05' },
    ],
    players: ['tig-oldcat', 'tig-k', 'tig-007'],
    stats: { totalKills: 920, avgDamage: 15800, winRate: 0.62 },
  },
  {
    id: 'sk',
    name: 'SK Gaming',
    nameEn: 'SK Gaming',
    logo: '/teams/sk-gaming.png',
    region: '欧洲',
    founded: '2019',
    style: ['擅长乱斗足球', '欧洲老牌', '团战配合'],
    history: [
      { event: '2025 LCQ 欧洲赛区', result: '四强', date: '2025-09' },
    ],
    players: ['sk-klaus', 'sk-ryan', 'sk-josh'],
    stats: { totalKills: 850, avgDamage: 16200, winRate: 0.60 },
  },
  {
    id: 'cr',
    name: 'Crazy Raccoon',
    nameEn: 'Crazy Raccoon',
    logo: '/teams/crazy-raccoon.png',
    region: '东亚',
    founded: '2022',
    style: ['擅长宝石争霸', '灵活变阵', '快节奏'],
    history: [
      { event: '2025 月赛 东亚赛区', result: '亚军', date: '2025-06' },
    ],
    players: ['cr-ak', 'cr-tn', 'cr-ryo'],
    stats: { totalKills: 780, avgDamage: 15500, winRate: 0.58 },
  },
];

// -------------------- 5. 选手（新增赛区字段） --------------------
export interface Player {
  id: string;
  name: string;
  teamId: string;
  region: TournamentRegion;
  role: '指挥' | '输出' | '辅助';
  topHeroes: string[];
  stats: { totalKills: number; avgDamage: number; winRate: number; matches: number };
}

export const players: Player[] = [
  {
    id: 'zeta-achapi',
    name: 'Achapi',
    teamId: 'zeta',
    region: '东亚',
    role: '输出',
    topHeroes: ['柯尔特', '布洛克', '瑞克', '贝亚', '塔拉'],
    stats: { totalKills: 420, avgDamage: 21000, winRate: 0.74, matches: 56 },
  },
  {
    id: 'zeta-sitetampo',
    name: 'Sitetampo',
    teamId: 'zeta',
    region: '东亚',
    role: '指挥',
    topHeroes: ['雪莉', '公牛', '达里尔', '罗莎', '艾尔·普里莫'],
    stats: { totalKills: 380, avgDamage: 19500, winRate: 0.76, matches: 56 },
  },
  {
    id: 'zeta-mameshi',
    name: 'Mameshi',
    teamId: 'zeta',
    region: '东亚',
    role: '辅助',
    topHeroes: ['波克', '杰西', '帕姆', 'P先生', '芽芽'],
    stats: { totalKills: 290, avgDamage: 15000, winRate: 0.71, matches: 52 },
  },
  {
    id: 'nova-xiaoming',
    name: '小明',
    teamId: 'nova-cn',
    region: '大陆',
    role: '输出',
    topHeroes: ['柯尔特', '麦克斯', '8比特', '斯派克', '吉恩'],
    stats: { totalKills: 310, avgDamage: 18500, winRate: 0.68, matches: 48 },
  },
  {
    id: 'nova-dawei',
    name: '大伟',
    teamId: 'nova-cn',
    region: '大陆',
    role: '指挥',
    topHeroes: ['雪莉', '公牛', '罗莎', '达里尔', '艾尔·普里莫'],
    stats: { totalKills: 280, avgDamage: 17500, winRate: 0.66, matches: 48 },
  },
  {
    id: 'tig-oldcat',
    name: '老猫',
    teamId: 'tig',
    region: '大陆',
    role: '辅助',
    topHeroes: ['波克', '杰西', '帕姆', 'P先生', '芽芽'],
    stats: { totalKills: 240, avgDamage: 14500, winRate: 0.64, matches: 45 },
  },
  {
    id: 'tig-k',
    name: 'K',
    teamId: 'tig',
    region: '大陆',
    role: '输出',
    topHeroes: ['柯尔特', '布洛克', '贝亚', '瑞克', '塔拉'],
    stats: { totalKills: 260, avgDamage: 16800, winRate: 0.63, matches: 45 },
  },
  {
    id: 'stmn-tensai',
    name: 'Tensai',
    teamId: 'stmn',
    region: '欧洲',
    role: '指挥',
    topHeroes: ['柯尔特', '布洛克', '瑞克', '贝亚', '塔拉'],
    stats: { totalKills: 350, avgDamage: 19000, winRate: 0.70, matches: 50 },
  },
  {
    id: 'sk-klaus',
    name: 'Klaus',
    teamId: 'sk',
    region: '欧洲',
    role: '输出',
    topHeroes: ['雪莉', '公牛', '达里尔', '麦克斯', '罗莎'],
    stats: { totalKills: 280, avgDamage: 16500, winRate: 0.62, matches: 42 },
  },
  {
    id: 'cr-ak',
    name: 'AK',
    teamId: 'cr',
    region: '东亚',
    role: '输出',
    topHeroes: ['柯尔特', '8比特', '贝亚', '斯派克', '吉恩'],
    stats: { totalKills: 260, avgDamage: 16000, winRate: 0.60, matches: 40 },
  },
];

// -------------------- 6. 赛程（新增分类和月份） --------------------
export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  tournamentName: string;
  teamA: string;
  teamB: string;
  category: TournamentCategory;
  region: TournamentRegion | null;
  month: string;
  streamUrl?: string;
  status: 'upcoming' | 'live' | 'ended';
}

export const schedules: ScheduleItem[] = liquipediaData.schedules as unknown as ScheduleItem[];

// -------------------- 7. 英雄赛事数据（新版：按月份、含场次） --------------------
export interface HeroTournamentStat {
  heroId: string;
  month: string;          // 如 '2025-01'
  role: string;           // 战士/射手/坦克/辅助/投弹手
  pickRate: number;
  banRate: number;
  winRate: number;
  pickCount: number;      // 选用场次
  banCount: number;       // 禁用场次
  matchCount: number;     // 总比赛场次
  mapRates: Record<string, number>;
}

export const heroTournamentStats: HeroTournamentStat[] = liquipediaData.heroTournamentStats as unknown as HeroTournamentStat[];

// -------------------- 8. 版本趋势（BP率前十 + 未使用） --------------------
export interface MetaTrend {
  month: string;
  topHeroes: { heroId: string; pickRate: number; banRate: number }[];
  unusedHeroes: string[];
}

export const metaTrends: MetaTrend[] = liquipediaData.metaTrends as unknown as MetaTrend[];

// -------------------- 9. 模式卡片（保持不变） --------------------
export type ModeCardItem =
  | { type: 'vertical'; id: string; title: string; subTitle: string; desc: string; bgImage: string; logo: string; }
  | { type: 'horizontal'; id: string; title: string; subTitle: string; bgImg: string; logo: string; };

export const modeCards: ModeCardItem[] = [
  { type: 'vertical', id: 'showdown', title: '荒野决斗', subTitle: '单人/双人吃鸡', desc: '活到最后就是胜利', bgImage: '/Usedinmode/mode1.png', logo: '/Usedinmode/icon/icon1.png' },
  { type: 'vertical', id: 'gemgrab', title: '宝石争霸', subTitle: '收集10颗宝石', desc: '团队配合最重要', bgImage: '/Usedinmode/mode2.png', logo: '/Usedinmode/icon/icon2.png' },
  { type: 'horizontal', id: 'brawlball', title: '乱斗足球', subTitle: 'BRAWL BALL', bgImg: '/Usedinmode/mode3.png', logo: '/usedinmode/icon/icon3.png' },
  { type: 'horizontal', id: 'knockout', title: '乱斗淘汰赛', subTitle: 'KNOCKOUT', bgImg: '/Usedinmode/mode4.png', logo: '/usedinmode/icon/icon4.png' },
  { type: 'horizontal', id: 'hotzone', title: '积分争夺赛', subTitle: 'HOT ZONE', bgImg: '/Usedinmode/mode5.png', logo: '/usedinmode/icon/icon5.png' },
  { type: 'horizontal', id: 'basketball', title: '乱斗篮球', subTitle: 'BASKET BRAWL', bgImg: '/Usedinmode/mode6.png', logo: '/usedinmode/icon/icon6.png' },
  { type: 'horizontal', id: 'duels', title: '车轮擂台赛', subTitle: 'DUELS', bgImg: '/Usedinmode/mode7.png', logo: '/usedinmode/icon/icon7.png' },
  { type: 'horizontal', id: 'bounty', title: '赏金猎人', subTitle: 'BOUNTY', bgImg: '/Usedinmode/mode8.png', logo: '/usedinmode/icon/icon8.png' },
];

// -------------------- 10. 地图列表（保持不变） --------------------
export interface MapItem {
  id: number;
  name: string;
  bg: string;
}

export const mapList: MapItem[] = [
  { id: 1, name: "热力工厂", bg: "/PromoArt/image1.png" },
  { id: 2, name: "双子河", bg: "/PromoArt/image2.png" },
  { id: 3, name: "骷髅溪", bg: "/PromoArt/image3.png" },
  { id: 4, name: "宝石矿场", bg: "/PromoArt/image4.png" },
  { id: 5, name: "蛇形小径", bg: "/PromoArt/image5.png" },
  { id: 6, name: "千柱之地", bg: "/PromoArt/image6.png" },
];

// -------------------- 11. 英雄详情（保持不变） --------------------
export interface Skill {
  name: string;
  desc: string;
  icon: string;
}

export interface HeroDetail {
  name: string;
  role: string;
  desc: string;
  image: string;
  bgImage: string;
  avatar: string;
  skills: Skill[];
  story: string;
}

export const heroDetailData: Record<string, HeroDetail> = {
  "1": {
    name: "雪莉",
    role: "战士",
    desc: "雪莉是荒野乱斗的新手入门战士，拿着一把霰弹枪闯荡荒野。性格爽朗直率，近距离爆发伤害极高，是新手最友好的英雄。",
    image: "/Sprite/xueli.webp",
    bgImage: "/Usedinheroes/bg/1.png",
    avatar: "/HeroAvatars/xueli.png",
    skills: [
      { name: "大口径散弹枪", desc: "雪莉的霰弹枪可大范围射出多枚射程较短的弹丸，命中敌人的弹丸越多，造成伤害越高", icon: "/Usedinheroes/skills/skill0.png" },
      { name: "超级霰弹", desc: "雪莉的超级霰弹可以摧毁掩体直击敌人。被命中的敌人即使未被击倒也会被击退。", icon: "/Usedinheroes/skills/skill01.png" },
      { name: "震荡射击", desc: "雪莉的超级霰弹可使敌人的移动速度降低，持续2秒", icon: "/heroes/skill3.png" },
      { name: "快速包扎", desc: "雪莉的生命值降至40%以下时，将立即恢复一定生命值。快速包扎触发间隔为15秒", icon: "/heroes/skill4.png" }
    ],
    story: "雪莉从小在荒野长大，习惯用霰弹枪解决一切麻烦，性格火爆仗义，是荒野里人人都认识的大姐头。"
  },
  // ... 其余英雄详情保持不变（省略以节省篇幅，你原有数据直接保留）
};