import { NextResponse } from 'next/server';

interface OfficialApiEvent {
  event?: {
    id?: number;
    mode?: string;
    map?: string;
  };
  slotId?: number;
  startTime?: string;
  endTime?: string;
}

/* Supercell 官方 API mode 名称 → 本站 modeId
 * 官方 mode 字段为空格分隔的英文名（如 "Gem Grab"），
 * BrawlAPI 为 camelCase（如 "gemGrab"），这里同时兼容两种写法。 */
const MODE_ID_MAP: Record<string, string> = {
  // camelCase (BrawlAPI 兼容) 与空格分隔 (Supercell 官方 API)
  // normalizeMode 会先把 key 转小写再查找，因此两种写法复用同一套小写键
  soloshowdown: 'showdown',
  duoshowdown: 'showdown',
  gemgrab: 'gemgrab',
  brawlball: 'brawlball',
  brawlball5v5: 'brawlball5v5',
  knockout: 'knockout',
  wipeout: 'wipeout',
  wipeout5v5: 'wipeout',
  hotzone: 'hotzone',
  basketbrawl: 'basketball',
  bounty: 'bounty',
  heist: 'heist',
  brawlhockey: 'brawlHockey',
  brawlarena: 'brawlArena',
  duels: 'duels',
};

function normalizeMode(raw?: string): string {
  if (!raw) return '';
  const key = raw.trim().toLowerCase();
  return MODE_ID_MAP[key] || key.replace(/\s+/g, '');
}

export async function GET() {
  try {
    const token = process.env.BRAWL_API_TOKEN;
    if (!token) {
      console.warn('BRAWL_API_TOKEN 未设置，无法请求 Supercell 官方 API');
      return NextResponse.json([], { status: 503 });
    }

    const res = await fetch('https://api.brawlstars.com/v1/events/rotation', {
      next: { revalidate: 300 }, // 5 分钟边缘缓存
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Supercell API ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = (await res.json()) as OfficialApiEvent[];
    if (!Array.isArray(data)) throw new Error('Invalid format');

    const rotation = data.map((evt) => {
      const raw = evt.event?.mode || '';
      return {
        modeId: normalizeMode(raw),
        rawMode: raw,
        mapName: evt.event?.map || '未知地图',
        endTime: evt.endTime || new Date(Date.now() + 3600000).toISOString(),
        slotId: evt.slotId,
      };
    });

    return NextResponse.json(rotation);
  } catch (err) {
    console.error('Rotation API Error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
