import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const WIKI_API_URL = 'https://brawlstars.fandom.com/api.php?action=parse&page=Ranked&prop=text&format=json';
const WIKI_PAGE_URL = 'https://brawlstars.fandom.com/wiki/Ranked';

// 4 周 = 28 天
const FOUR_WEEKS_IN_SECONDS = 28 * 24 * 60 * 60;

// Wiki 模式名 → 本站模式名（与 modeNameCnMap 键对齐）
const MODE_NORMALIZE: Record<string, string> = {
  'Gem Grab': 'Gem Grab',
  'Brawl Ball': 'Brawl Ball',
  'Bounty': 'Bounty',
  'Heist': 'Heist',
  'Hot Zone': 'Hot Zone',
  'Knockout': 'Knockout',
  'Solo Showdown': 'Solo Showdown',
  'Duo Showdown': 'Duo Showdown',
  'Duels': 'Duels',
  'Wipeout': 'Wipeout',
  'Basket Brawl': 'Basket Brawl',
  'Hunters': 'Hunters',
  'Hockey': 'Hockey',
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

interface RankedMapPool {
  season: string;
  period: string;
  source: string;
  url: string;
  updatedAt: string;
  pools: Record<string, string[]>;
  allMapNames: string[];
}

export async function GET() {
  try {
    const res = await fetch(WIKI_API_URL, {
      next: { revalidate: FOUR_WEEKS_IN_SECONDS },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BrawlStarsDataBot/1.0)',
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Fandom API ${res.status}`);
    }

    const apiData = await res.json();
    const html = apiData?.parse?.text?.['*'];
    if (typeof html !== 'string') {
      throw new Error('Fandom API 返回格式异常');
    }

    const $ = cheerio.load(html);

    // 1. 提取赛季号，例如 "Active maps (Season 46)"
    let season = 'Current Season';
    const seasonMatch = html.match(/Active maps \(Season (\d+)\)/);
    if (seasonMatch) {
      season = `Season ${seasonMatch[1]}`;
    }

    // 2. 定位 Maps 章节下的表格
    // #Maps 是 span，需要先找到外层 h3
    const mapsHeading = $('#Maps').closest('h3');
    if (!mapsHeading.length) {
      throw new Error('未找到 Maps 章节');
    }

    const table = mapsHeading.nextAll('table.mw-collapsible').first();
    if (!table.length) {
      throw new Error('未找到 Active maps 表格');
    }

    const pools: Record<string, string[]> = {};

    table.find('tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length < 2) return;

      // 第一个单元格是模式图标链接
      const modeName = cells.first().find('a').attr('title')?.trim();
      if (!modeName) return;

      const normalizedMode = MODE_NORMALIZE[modeName] ?? modeName;
      const maps: string[] = [];

      // 后续单元格是地图
      cells.slice(1).each((__, cell) => {
        const mapName = $(cell).find('a').last().attr('title')?.trim();
        if (mapName) {
          maps.push(decodeHtmlEntities(mapName));
        }
      });

      if (maps.length > 0) {
        pools[normalizedMode] = maps;
      }
    });

    if (Object.keys(pools).length === 0) {
      throw new Error('解析到的排位地图池为空');
    }

    const allMapNames = Array.from(new Set(Object.values(pools).flat()));

    const result: RankedMapPool = {
      season,
      period: '当前排位赛季',
      source: 'Brawl Stars Wiki - Ranked',
      url: WIKI_PAGE_URL,
      updatedAt: new Date().toISOString(),
      pools,
      allMapNames,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Ranked Maps Crawler Error:', error);
    return NextResponse.json(
      {
        season: 'Unknown',
        period: '当前排位赛季',
        source: 'Brawl Stars Wiki - Ranked',
        url: WIKI_PAGE_URL,
        updatedAt: new Date().toISOString(),
        pools: {},
        allMapNames: [],
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
