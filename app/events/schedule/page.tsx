'use client';

import { schedules, type TournamentCategory, type TournamentRegion } from '@/lib/data/esports';
import { useState, useMemo } from 'react';
import Link from 'next/link';

type StatusFilter = 'all' | 'upcoming' | 'ended';
type CategoryFilter = TournamentCategory | '全部';

const MONTHS = [
  '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
  '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
];

export default function SchedulePage() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('全部');
  const [month, setMonth] = useState<string>('全部');

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: '全部', label: '全部' },
    { key: 'LCQ', label: 'LCQ' },
    { key: '全球总决赛', label: '全球总决赛' },
    { key: 'brawlcup', label: 'brawlcup' },
    { key: '月赛', label: '月赛' },
  ];

  const filtered = useMemo(() => {
    return schedules.filter(s => {
      if (status !== 'all' && s.status !== status) return false;
      if (category !== '全部' && s.category !== category) return false;
      if (month !== '全部' && s.month !== month) return false;
      return true;
    });
  }, [status, category, month]);

  const getStatusBadge = (status: string) => {
    if (status === 'live') return <span className="px-2 py-1 rounded bg-red-500 text-white text-xs font-black animate-pulse">LIVE</span>;
    if (status === 'upcoming') return <span className="px-2 py-1 rounded bg-blue-500 text-white text-xs font-bold">即将开始</span>;
    return <span className="px-2 py-1 rounded bg-white/10 text-white/50 text-xs font-bold">已结束</span>;
  };

  return (
    <main className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-[#154BCD] to-[#0f2a8a]">
      <div className="max-w-4xl mx-auto px-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/events" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm font-bold text-white hover:bg-[#FFD500] hover:text-[#1A3A8A] hover:border-[#FFD500] transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            返回赛事中心
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-sm font-bold text-white/60">赛程日历</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#FFD500] mb-6 drop-shadow-lg">赛程日历</h1>

        {/* 状态筛选 */}
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { key: 'all', label: '全部' },
            { key: 'upcoming', label: '即将开始' },
            { key: 'ended', label: '已结束' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key as StatusFilter)}
              className={`px-5 py-2 rounded-full font-bold transition-all duration-300 ${
                status === f.key ? 'bg-[#FFD500] text-[#1A3A8A] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 赛事类型筛选 */}
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="text-sm font-bold text-white/50 py-2">类型:</span>
          {categories.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                category === c.key
                  ? 'bg-white/25 text-white border border-white/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 月份筛选 */}
        <div className="flex flex-wrap gap-2 mb-8 max-h-24 overflow-y-auto hide-scrollbar p-1">
          <button
            onClick={() => setMonth('全部')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              month === '全部' ? 'bg-[#FFD500] text-[#1A3A8A]' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            全部
          </button>
          {MONTHS.map(m => (
            <button
              key={m}
              onClick={() => setMonth(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                month === m ? 'bg-[#FFD500] text-[#1A3A8A]' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white/60">{s.date} {s.time}</span>
                  {s.region && (
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white/60">{s.region}</span>
                  )}
                </div>
                {getStatusBadge(s.status)}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-[#FFD500]/15 text-[10px] font-bold text-[#FFD500]">{s.category}</span>
                <span className="text-xs text-white/40 font-mono">{s.month}</span>
              </div>
              <h3 className="text-lg font-black text-white mb-3">{s.tournamentName}</h3>
              <div className="flex items-center justify-between bg-black/20 rounded-xl p-4">
                <div className="text-lg font-black text-white">{s.teamA}</div>
                <div className="text-sm font-bold text-white/30">VS</div>
                <div className="text-lg font-black text-white">{s.teamB}</div>
              </div>
              {s.streamUrl && s.status !== 'ended' && (
                <a
                  href={s.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD500] text-[#1A3A8A] text-sm font-black hover:scale-105 transition-transform"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  观看直播
                </a>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/50 font-bold">
            暂无符合条件的赛程
          </div>
        )}
      </div>
    </main>
  );
}