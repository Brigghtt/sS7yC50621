// lib/data/esports.ts
// ============================================================
// 电竞模块统一数据层
// ============================================================

// -------------------- 1. 赛事档案 --------------------
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
  level: '全球总决赛' | '月度总决赛' | '地区预选赛' | '国服杯赛';
  format: string;
  version: string;
  teamA: { name: string; nameEn: string; logo: string };
  teamB: { name: string; nameEn: string; logo: string };
  score: string;
  winner: 'A' | 'B';
  matches: MatchGame[];
  videoUrl?: string;
}

export const tournaments: Tournament[] = [
  {
    id: 'bsc2024-final',
    name: '2024 BSC 全球总决赛 半决赛',
    date: '2024-11-16',
    level: '全球总决赛',
    format: 'BO5',
    version: 'v56.250',
    teamA: { name: 'ZETA DIVISION', nameEn: 'ZETA DIVISION', logo: '/teams/zeta.png' },
    teamB: { name: 'STMN Esports', nameEn: 'STMN Esports', logo: '/teams/stmn.png' },
    score: '3:2',
    winner: 'A',
    matches: [
      { map: '宝石矿场', mode: '宝石争霸', teamA: { heroes: ['雪莉','柯尔特','杰西'], win: true }, teamB: { heroes: ['公牛','布洛克','迪克'], win: false } },
      { map: '双子河', mode: '乱斗足球', teamA: { heroes: ['麦克斯','罗莎','波克'], win: false }, teamB: { heroes: ['达里尔','雅琪','帕姆'], win: true } },
      { map: '热力工厂', mode: '荒野决斗', teamA: { heroes: ['斯派克','黑鸦'], win: true }, teamB: { heroes: ['里昂','沙迪'], win: false } },
    ],
    videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
  },
  {
    id: 'bsc2024-monthly',
    name: '2024 BSC 月度总决赛',
    date: '2024-10-12',
    level: '月度总决赛',
    format: 'BO3',
    version: 'v56.200',
    teamA: { name: 'ZETA DIVISION', nameEn: 'ZETA DIVISION', logo: '/teams/zeta.png' },
    teamB: { name: 'STMN Esports', nameEn: 'STMN Esports', logo: '/teams/stmn.png' },
    score: '3:1',
    winner: 'A',
    matches: [
      { map: '宝石矿场', mode: '宝石争霸', teamA: { heroes: ['柯尔特','布洛克','罗莎'], win: true }, teamB: { heroes: ['雪莉','公牛','达里尔'], win: false } },
    ],
  },
  {
    id: 'cn-cup-2024',
    name: '2024 荒野乱斗国服杯赛 决赛',
    date: '2024-08-20',
    level: '国服杯赛',
    format: 'BO5',
    version: 'v55.100',
    teamA: { name: 'Nova China', nameEn: 'Nova China', logo: '/teams/nova.png' },
    teamB: { name: 'TIG', nameEn: 'TIG', logo: '/teams/tig.png' },
    score: '3:2',
    winner: 'A',
    matches: [
      { map: '骷髅溪', mode: '乱斗足球', teamA: { heroes: ['麦克斯','柯尔特','罗莎'], win: true }, teamB: { heroes: ['雪莉','公牛','达里尔'], win: false } },
      { map: '千柱之地', mode: '宝石争霸', teamA: { heroes: ['杰西','8比特','帕姆'], win: false }, teamB: { heroes: ['塔拉','吉恩','沙迪'], win: true } },
    ],
  },
  {
    id: 'cn-qualifier-2024',
    name: '2024 BSC 中国区预选赛',
    date: '2024-06-15',
    level: '地区预选赛',
    format: '双败淘汰',
    version: 'v54.300',
    teamA: { name: 'Nova China', nameEn: 'Nova China', logo: '/teams/nova.png' },
    teamB: { name: 'TIG', nameEn: 'TIG', logo: '/teams/tig.png' },
    score: '2:1',
    winner: 'A',
    matches: [
      { map: '蛇形小径', mode: '赏金猎人', teamA: { heroes: ['柯尔特','贝亚','塔拉'], win: true }, teamB: { heroes: ['布洛克','瑞克','斯派克'], win: false } },
    ],
  },
];

// -------------------- 2. 战队 --------------------
export interface Team {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  region: string;
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
    logo: '/teams/zeta.png',
    region: '日本 / 亚太',
    founded: '2021',
    style: ['擅长乱斗足球', '偏好双射手体系', '快节奏推进'],
    history: [
      { event: '2024 BSC 全球总决赛', result: '冠军', date: '2024-11' },
      { event: '2024 BSC 月度总决赛', result: '冠军', date: '2024-09' },
    ],
    players: ['zeta-achapi', 'zeta-sitetampo', 'zeta-mameshi'],
    stats: { totalKills: 1248, avgDamage: 18500, winRate: 0.72 },
  },
  {
    id: 'stmn',
    name: 'STMN Esports',
    nameEn: 'STMN Esports',
    logo: '/teams/stmn.png',
    region: '北美',
    founded: '2020',
    style: ['擅长宝石争霸', '稳健控图', '后期发力'],
    history: [
      { event: '2024 BSC 全球总决赛', result: '亚军', date: '2024-11' },
      { event: '2024 BSC 月度总决赛', result: '亚军', date: '2024-10' },
    ],
    players: ['stmn-tensai', 'stmn-bobby', 'stmn-moya'],
    stats: { totalKills: 1156, avgDamage: 17200, winRate: 0.68 },
  },
  {
    id: 'nova-cn',
    name: 'Nova China',
    nameEn: 'Nova China',
    logo: '/teams/nova.png',
    region: '中国大陆',
    founded: '2022',
    style: ['擅长乱斗足球', '近战突脸', '国服霸主'],
    history: [
      { event: '2024 荒野乱斗国服杯赛', result: '冠军', date: '2024-08' },
      { event: '2024 BSC 中国区预选赛', result: '冠军', date: '2024-06' },
    ],
    players: ['nova-xiaoming', 'nova-dawei', 'nova-lei'],
    stats: { totalKills: 980, avgDamage: 16000, winRate: 0.65 },
  },
  {
    id: 'tig',
    name: 'TIG',
    nameEn: 'TIG',
    logo: '/teams/tig.png',
    region: '中国大陆',
    founded: '2023',
    style: ['擅长赏金猎人', '远程消耗', '阵地战'],
    history: [
      { event: '2024 荒野乱斗国服杯赛', result: '亚军', date: '2024-08' },
      { event: '2024 BSC 中国区预选赛', result: '亚军', date: '2024-06' },
    ],
    players: ['tig-oldcat', 'tig-k', 'tig-007'],
    stats: { totalKills: 920, avgDamage: 15800, winRate: 0.62 },
  },
];

// -------------------- 3. 选手 --------------------
export interface Player {
  id: string;
  name: string;
  teamId: string;
  role: '指挥' | '输出' | '辅助';
  topHeroes: string[];
  stats: { totalKills: number; avgDamage: number; winRate: number; matches: number };
}

export const players: Player[] = [
  {
    id: 'zeta-achapi',
    name: 'Achapi',
    teamId: 'zeta',
    role: '输出',
    topHeroes: ['柯尔特', '布洛克', '瑞克', '贝亚', '塔拉'],
    stats: { totalKills: 420, avgDamage: 21000, winRate: 0.74, matches: 56 },
  },
  {
    id: 'zeta-sitetampo',
    name: 'Sitetampo',
    teamId: 'zeta',
    role: '指挥',
    topHeroes: ['雪莉', '公牛', '达里尔', '罗莎', '艾尔·普里莫'],
    stats: { totalKills: 380, avgDamage: 19500, winRate: 0.76, matches: 56 },
  },
  {
    id: 'zeta-mameshi',
    name: 'Mameshi',
    teamId: 'zeta',
    role: '辅助',
    topHeroes: ['波克', '杰西', '帕姆', 'P先生', '芽芽'],
    stats: { totalKills: 290, avgDamage: 15000, winRate: 0.71, matches: 52 },
  },
  {
    id: 'nova-xiaoming',
    name: '小明',
    teamId: 'nova-cn',
    role: '输出',
    topHeroes: ['柯尔特', '麦克斯', '8比特', '斯派克', '吉恩'],
    stats: { totalKills: 310, avgDamage: 18500, winRate: 0.68, matches: 48 },
  },
  {
    id: 'nova-dawei',
    name: '大伟',
    teamId: 'nova-cn',
    role: '指挥',
    topHeroes: ['雪莉', '公牛', '罗莎', '达里尔', '艾尔·普里莫'],
    stats: { totalKills: 280, avgDamage: 17500, winRate: 0.66, matches: 48 },
  },
  {
    id: 'tig-oldcat',
    name: '老猫',
    teamId: 'tig',
    role: '辅助',
    topHeroes: ['波克', '杰西', '帕姆', 'P先生', '芽芽'],
    stats: { totalKills: 240, avgDamage: 14500, winRate: 0.64, matches: 45 },
  },
  {
    id: 'tig-k',
    name: 'K',
    teamId: 'tig',
    role: '输出',
    topHeroes: ['柯尔特', '布洛克', '贝亚', '瑞克', '塔拉'],
    stats: { totalKills: 260, avgDamage: 16800, winRate: 0.63, matches: 45 },
  },
];

// -------------------- 4. 赛程 --------------------
export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  tournamentName: string;
  teamA: string;
  teamB: string;
  streamUrl?: string;
  status: 'upcoming' | 'live' | 'ended';
}

export const schedules: ScheduleItem[] = [
  {
    id: 'sch-1',
    date: '2026-06-20',
    time: '18:00',
    tournamentName: '2026 BSC 月度总决赛',
    teamA: 'ZETA DIVISION',
    teamB: 'STMN Esports',
    streamUrl: 'https://live.bilibili.com/xxx',
    status: 'upcoming',
  },
  {
    id: 'sch-2',
    date: '2026-06-22',
    time: '20:00',
    tournamentName: '2026 荒野乱斗国服杯赛 半决赛',
    teamA: 'Nova China',
    teamB: 'TIG',
    streamUrl: 'https://live.bilibili.com/yyy',
    status: 'upcoming',
  },
  {
    id: 'sch-3',
    date: '2026-06-15',
    time: '19:00',
    tournamentName: '2026 BSC 地区预选赛',
    teamA: 'SK Gaming',
    teamB: 'Reply Totem',
    status: 'ended',
  },
];

// -------------------- 5. 数据洞察 --------------------
export interface HeroTournamentStat {
  heroId: string;
  pickRate: number;
  banRate: number;
  winRate: number;
  mapRates: Record<string, number>;
}

export interface TeamComp {
  name: string;
  heroes: string[];
  winRate: number;
  usage: number;
}

export interface MetaTrend {
  version: string;
  topHeroes: { heroId: string; pickRate: number }[];
}

export const heroTournamentStats: HeroTournamentStat[] = [
  { heroId: '柯尔特', pickRate: 0.82, banRate: 0.15, winRate: 0.58, mapRates: { '宝石矿场': 0.92, '双子河': 0.75 } },
  { heroId: '雪莉', pickRate: 0.78, banRate: 0.22, winRate: 0.61, mapRates: { '热力工厂': 0.88, '骷髅溪': 0.80 } },
  { heroId: '布洛克', pickRate: 0.65, banRate: 0.30, winRate: 0.55, mapRates: { '宝石矿场': 0.70, '蛇形小径': 0.85 } },
  { heroId: '罗莎', pickRate: 0.60, banRate: 0.10, winRate: 0.63, mapRates: { '双子河': 0.78, '千柱之地': 0.72 } },
  { heroId: '麦克斯', pickRate: 0.55, banRate: 0.25, winRate: 0.59, mapRates: { '乱斗足球': 0.82, '宝石争霸': 0.68 } },
];

export const teamComps: TeamComp[] = [
  { name: '双射手推进', heroes: ['柯尔特', '布洛克', '罗莎'], winRate: 0.62, usage: 0.18 },
  { name: '近战突脸', heroes: ['雪莉', '公牛', '达里尔'], winRate: 0.58, usage: 0.15 },
  { name: '阵地消耗', heroes: ['杰西', '8比特', '帕姆'], winRate: 0.55, usage: 0.12 },
  { name: '控场拉扯', heroes: ['塔拉', '吉恩', '沙迪'], winRate: 0.60, usage: 0.10 },
];

export const metaTrends: MetaTrend[] = [
  { version: 'v56.200', topHeroes: [{ heroId: '柯尔特', pickRate: 0.85 }, { heroId: '雪莉', pickRate: 0.80 }, { heroId: '布洛克', pickRate: 0.70 }] },
  { version: 'v56.250', topHeroes: [{ heroId: '柯尔特', pickRate: 0.82 }, { heroId: '雪莉', pickRate: 0.78 }, { heroId: '麦克斯', pickRate: 0.72 }] },
  { version: 'v57.100', topHeroes: [{ heroId: '雪莉', pickRate: 0.85 }, { heroId: '罗莎', pickRate: 0.75 }, { heroId: '柯尔特', pickRate: 0.74 }] },
];