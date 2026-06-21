'use client';

import { heroTournamentStats, metaTrends } from '@/lib/data/esports';
import { useState, useMemo } from 'react';
import Link from 'next/link';

type SortKey = 'bp' | 'pick' | 'ban' | 'win';
type HeroRole = '全部' | '战士' | '射手' | '坦克' | '辅助' | '投弹手';

const MONTHS = [
  '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
  '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05',
];

export default function StatsPage() {
  const [tab, setTab] = useState<'hero' | 'trend'>('hero');
  const [month, setMonth] = useState('2026-05');
  const [sort, setSort] = useState<SortKey>('bp');
  const [role, setRole] = useState<HeroRole>('全部');

  const roles: HeroRole[] = ['全部', '战士', '射手', '坦克', '辅助', '投弹手'];

  const filteredHeroes = useMemo(() => {
    let data = heroTournamentStats.filter(h => h.month === month);
    if (role !== '全部') data = data.filter(h => h.role === role);

    return data.sort((a, b) => {
      if (sort === 'bp') return (b.pickRate + b.banRate) - (a.pickRate + a.banRate);
      if (sort === 'pick') return b.pickRate - a.pickRate;
      if (sort === 'ban') return b.banRate - a.banRate;
      if (sort === 'win') return b.winRate - a.winRate;
      return 0;
    });
  }, [month, sort, role]);

  const currentTrend = metaTrends.find(m => m.month === month);

  return (
    <main className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-[#154BCD] to-[#0f2a8a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/events" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm font-bold text-white hover:bg-[#FFD500] hover:text-[#1A3A8A] hover:border-[#FFD500] transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            返回赛事中心
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-sm font-bold text-white/60">数据洞察</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#FFD500] mb-8 drop-shadow-lg">数据洞察</h1>
        
        <div className="flex gap-3 mb-8">
          {[
            { key: 'hero', label: '英雄赛事数据' },
            { key: 'trend', label: '版本趋势' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'hero' | 'trend')}
              className={`px-5 py-2 rounded-full font-bold transition-all duration-300 ${
                tab === t.key ? 'bg-[#FFD500] text-[#1A3A8A] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 月份选择器（两个 tab 共用） */}
        <div className="flex flex-wrap gap-2 mb-8 max-h-32 overflow-y-auto hide-scrollbar p-1">
          {MONTHS.map(m => (
            <button
              key={m}
              onClick={() => setMonth(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                month === m
                  ? 'bg-[#FFD500] text-[#1A3A8A]'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        
        {tab === 'hero' && (
          <>
            {/* 排序 + 分类筛选 */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm font-bold text-white/50">排序:</span>
              {[
                { key: 'bp', label: 'BP率' },
                { key: 'pick', label: 'Pick率' },
                { key: 'ban', label: 'Ban率' },
                { key: 'win', label: '胜率' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key as SortKey)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    sort === s.key
                      ? 'bg-white/25 text-white border border-white/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              
              <div className="w-px h-6 bg-white/20 mx-2" />
              
              <span className="text-sm font-bold text-white/50">分类:</span>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    role === r
                      ? 'bg-white/25 text-white border border-white/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredHeroes.map(h => (
                <div key={h.heroId} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black text-white">{h.heroId}</h3>
                      <span className="px-2 py-1 rounded bg-white/10 text-xs font-bold text-white/60">{h.role}</span>
                    </div>
                    <span className="text-sm font-bold text-[#FFD500]">胜率 {(h.winRate * 100).toFixed(0)}%</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-black text-[#FFD500]">{((h.pickRate + h.banRate) * 100).toFixed(0)}%</div>
                      <div className="text-xs text-white/50 font-bold">BP率</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-black text-white">{(h.pickRate * 100).toFixed(0)}%</div>
                      <div className="text-xs text-white/50 font-bold">Pick率</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-black text-white">{(h.banRate * 100).toFixed(0)}%</div>
                      <div className="text-xs text-white/50 font-bold">Ban率</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-black text-white">{h.pickCount}</div>
                      <div className="text-xs text-white/50 font-bold">选用场次</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-center">
                      <div className="text-lg font-black text-white">{h.banCount}</div>
                      <div className="text-xs text-white/50 font-bold">禁用场次</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(h.mapRates).map(([map, rate]) => (
                      <span key={map} className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white/80">
                        {map}: {(rate * 100).toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {tab === 'trend' && currentTrend && (
          <div className="space-y-8">
            {/* BP率前十 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-black text-[#FFD500] mb-6">BP率前十英雄</h3>
              <div className="space-y-3">
                {currentTrend.topHeroes.map((h, i) => (
                  <div key={h.heroId} className="flex items-center gap-4">
                    <div className="w-6 text-center font-black text-white/50">{i + 1}</div>
                    <div className="w-24 font-bold text-white">{h.heroId}</div>
                    <div className="flex-1 bg-black/20 rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-[#FFD500] rounded-full" style={{ width: `${h.pickRate * 100}%` }} />
                    </div>
                    <div className="w-16 text-right font-black text-[#FFD500]">{(h.pickRate * 100).toFixed(0)}%</div>
                    <div className="w-16 text-right font-bold text-white/60">Ban {(h.banRate * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 未被使用的英雄 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-black text-white/60 mb-4">本月未被选用的英雄</h3>
              <div className="flex flex-wrap gap-2">
                {currentTrend.unusedHeroes.map(h => (
                  <span key={h} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-bold text-white/40">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}