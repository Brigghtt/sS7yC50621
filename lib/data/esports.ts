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
export type TournamentRegion = '欧洲' | '东亚' | '大陆' | '北美' | '南美';
export type EliminationRound = '全部' | '八强赛' | '四强赛' | '半决赛' | '总决赛';
export type SubCategory = '小组赛' | '淘汰赛';

export interface MatchGame {
  map: string;
  mode: string;
  teamA: { heroes: string[]; win: boolean };
  teamB: { heroes: string[]; win: boolean };
}

export interface GroupStageTeam {
  name: string;
  nameEn: string;
  logo: string;
  rank: number;
  weekWins: number[];
  weekLosses: number[];
  weekScores: number[];
  totalWins: number;
  totalLosses: number;
  totalScoreDiff: number;
}

export interface GroupStageGroup {
  name: string;
  teams: GroupStageTeam[];
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
  groupStage?: GroupStageGroup[];
}

import liquipediaData from './liquipediaTournaments.json';

export const tournaments: Tournament[] = liquipediaData.tournaments as unknown as Tournament[];

// -------------------- 4. 战队（新增赛区字段） --------------------
export interface Team {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  region: TournamentRegion | null;
  founded: string;
  style: string[];
  history: { event: string; result: string; date: string }[];
  players: string[];
  stats: { totalKills: number; avgDamage: number; winRate: number };
}

import liquipediaTeamsData from './liquipediaTeams.json';
import liquipediaPlayersData from './liquipediaPlayers.json';

export const teams: Team[] = liquipediaTeamsData as unknown as Team[];

// teams 数据由 scripts/fetch_liquipedia_esports.py 生成并写入 liquipediaTeams.json
// 如需补充静态信息，请修改脚本或编辑 JSON

// -------------------- 5. 选手（新增赛区字段） --------------------
export interface Player {
  id: string;
  name: string;
  nameEn: string;
  realName?: string;       // 真实姓名（来自 Portal:Players）
  teamId: string;
  region: TournamentRegion | null;
  nationality: string;
  born: string;
  status: string;
  role: string;
  currentTeam: string;
  totalWinnings: string;
  portrait: string;
  teamHistory: { team: string; startDate: string | null; endDate: string | null }[];
  topHeroes: string[];
  stats: { totalKills: number; avgDamage: number; winRate: number; matches: number };
  links?: { platform: string; url: string }[];  // 社交/直播链接
}

export const players: Player[] = liquipediaPlayersData as unknown as Player[];

// players 数据由 scripts/fetch_liquipedia_esports.py 生成并写入 liquipediaPlayers.json
// 如需补充静态信息，请修改脚本或编辑 JSON

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

// -------------------- 11. 赛事资产映射（英雄头像 / 模式图标 / 地图背景 / 地图翻译） --------------------
import { heroDetailsData } from './heroDetails';
import { mapNameCnMap } from './mapTranslations';

/** 英雄中文名 -> 大头头像路径 */
export const heroAvatarMap: Record<string, string> = {};
for (const h of Object.values(heroDetailsData)) {
  if (h.name && h.avatar) {
    heroAvatarMap[h.name] = h.avatar;
  }
}

/** 模式中文名 -> 图标路径（本地优先，缺失模式回退到 Brawlify CDN） */
export const modeIconMap: Record<string, string> = {
  '宝石争霸': '/Usedinmode/icon/gemgrab.png',
  '乱斗足球': '/Usedinmode/icon/brawlball.png',
  '赏金猎人': '/Usedinmode/icon/bounty.png',
  '乱斗淘汰赛': '/Usedinmode/icon/knockout.png',
  '荒野决斗': '/Usedinmode/icon/showdown.png',
  '乱斗篮球': '/Usedinmode/icon/basketbrawl.png',
  '围歼': '/Usedinmode/icon/wipeout.png',
  '车轮擂台赛': '/Usedinmode/icon/duels.png',
  '金库攻防': 'https://cdn.brawlify.com/game-modes/regular/48000002.png',
  '积分争夺赛': 'https://cdn.brawlify.com/game-modes/regular/48000017.png',
  '乱斗冰球': 'https://cdn.brawlify.com/game-modes/regular/48000045.png',
  '乱斗竞技场': 'https://cdn.brawlify.com/game-modes/regular/48000048.png',
  '5对5宝石争霸': 'https://cdn.brawlify.com/game-modes/regular/48000033.png',
  '5对5乱斗足球': 'https://cdn.brawlify.com/game-modes/regular/48000032.png',
  '5对5乱斗淘汰赛': 'https://cdn.brawlify.com/game-modes/regular/48000035.png',
};

/** 模式中文名 -> 背景 GIF 路径 */
export const modeBgMap: Record<string, string> = {
  '宝石争霸': '/Usedinmode/gem_grab.gif',
  '乱斗足球': '/Usedinmode/brawl_ball.gif',
  '赏金猎人': '/Usedinmode/bounty.gif',
  '金库攻防': '/Usedinmode/heist.gif',
  '积分争夺赛': '/Usedinmode/hot_zone.gif',
  '乱斗淘汰赛': '/Usedinmode/knockout.gif',
  '荒野决斗': '/Usedinmode/showdown.gif',
  '乱斗篮球': '/Usedinmode/basket_brawl.gif',
  '排球乱斗': '/Usedinmode/volley_brawl.gif',
  '奖杯大盗': '/Usedinmode/trophy_thieves.gif',
  '夺杯飞逃': '/Usedinmode/hold_the_trophy.gif',
  '围歼': '/Usedinmode/wipeout.gif',
  '首领之战': '/Usedinmode/big_game.gif',
  '机甲入侵': '/Usedinmode/robo_rumble.gif',
  '机甲攻坚战': '/Usedinmode/siege.gif',
  '礼物狂欢': '/Usedinmode/present_plunder.gif',
  '车轮擂台赛': '/Usedinmode/duels.gif',
  '乱斗冰球': '/Usedinmode/brawl_hockey.gif',
};

/** 地图名 -> 背景图路径（暂无逐地图素材，回退到模式背景） */
export const mapImageMap: Record<string, string> = {};
export function getMapImage(mapName: string, modeName?: string): string {
  if (mapImageMap[mapName]) return mapImageMap[mapName];
  if (modeName && modeBgMap[modeName]) return modeBgMap[modeName];
  return '/PromoArt/image2.png';
}

/** 根据英雄中文名获取头像（找不到时返回空） */
export function getHeroAvatar(heroName: string): string {
  return heroAvatarMap[heroName] || '';
}

/** 把英文地图名翻译成 Supercell 官方中文（未命中返回原名） */
export function translateMapName(mapName: string): string {
  return mapNameCnMap[mapName] || mapName;
}