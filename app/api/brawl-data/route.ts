// app/api/brawl-data/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 并发请求 BrawlAPI（公开接口，无需 token）
    const [mapsRes, eventsRes] = await Promise.all([
      fetch('https://api.brawlapi.com/v1/maps', { next: { revalidate: 60 } }),
      fetch('https://api.brawlapi.com/v1/events', { next: { revalidate: 60 } }),
    ]);

    if (!mapsRes.ok || !eventsRes.ok) {
      throw new Error(`BrawlAPI 响应异常: Maps(${mapsRes.status}), Events(${eventsRes.status})`);
    }

    const mapsData = await mapsRes.json();
    const eventsData = await eventsRes.json();

    return NextResponse.json({
      maps: mapsData,
      events: eventsData,
    });
  } catch (error: unknown) {
    console.error('服务端代理请求失败:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: '无法连接到荒野乱斗海外服务器' }, { status: 500 });
  }
}
