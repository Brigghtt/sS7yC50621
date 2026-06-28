export interface RarityInfo {
  name: string;
  color: string;
}

const RARITY_MAP: Record<string, RarityInfo> = {
  普通: { name: '普通', color: '#b9eaff' },
  Common: { name: '普通', color: '#b9eaff' },
  稀有: { name: '稀有', color: '#68fd58' },
  Rare: { name: '稀有', color: '#68fd58' },
  超稀有: { name: '超稀有', color: '#5ab3ff' },
  'Super Rare': { name: '超稀有', color: '#5ab3ff' },
  史诗: { name: '史诗', color: '#d850ff' },
  Epic: { name: '史诗', color: '#d850ff' },
  神话: { name: '神话', color: '#fe5e72' },
  Mythic: { name: '神话', color: '#fe5e72' },
  传奇: { name: '传奇', color: '#fff11e' },
  Legendary: { name: '传奇', color: '#fff11e' },
  流彩: { name: '流彩', color: '#e1fb2a' },
  Chromatic: { name: '流彩', color: '#e1fb2a' },
};

export function getRarityInfo(name?: string | null): RarityInfo {
  if (!name) return { name: '未知', color: '#888888' };
  return RARITY_MAP[name] || { name, color: '#888888' };
}
