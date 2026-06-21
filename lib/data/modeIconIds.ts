// 本站 modeId → Brawlify 游戏模式 numeric ID
// 图标地址：https://cdn.brawlify.com/game-modes/regular/{id}.png
export const BRAWLIFY_MODE_ICON_IDS: Record<string, number> = {
  showdown: 48000006,      // Showdown（荒野决斗，包含单/双/三人）
  gemgrab: 48000000,       // Gem Grab（宝石争霸）
  gemgrab5v5: 48000033,    // Gem Grab 5v5（5对5宝石争霸）
  brawlball: 48000005,     // Brawl Ball（乱斗足球）
  brawlball5v5: 48000032,  // Brawl Ball 5v5（5对5乱斗足球）
  knockout: 48000020,      // Knockout（乱斗淘汰赛）
  knockout5v5: 48000035,   // Knockout 5v5（5对5乱斗淘汰赛）
  hotzone: 48000017,       // Hot Zone（热区争夺/积分争夺赛）
  basketball: 48000022,    // Basket Brawl（乱斗篮球）
  duels: 48000024,         // Duels（车轮擂台赛）
  bounty: 48000003,        // Bounty（赏金猎人）
  wipeout: 48000031,       // Wipeout 5v5（5对5乱斗淘汰赛）
  brawlHockey: 48000045,   // Brawl Hockey（乱斗冰球）
  brawlArena: 48000048,    // Brawl Arena（乱斗竞技场）
  heist: 48000002,         // Heist（金库攻防）
};

export function getBrawlifyModeIconUrl(modeId: string): string {
  const id = BRAWLIFY_MODE_ICON_IDS[modeId];
  if (!id) return '';
  return `https://cdn.brawlify.com/game-modes/regular/${id}.png`;
}
