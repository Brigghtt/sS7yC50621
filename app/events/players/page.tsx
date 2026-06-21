'use client';

import Link from 'next/link';
import { players, teams, type TournamentRegion } from '@/lib/data/esports';
import { useState, useMemo } from 'react';

export default function PlayersPage() {
  const [region, setRegion] = useState<TournamentRegion | '全部'>('全部');
  const regions: (TournamentRegion | '全部')[] = ['全部', '欧洲', '东亚', '大陆'];

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || id;

  const filtered = useMemo(() => {
    if (region === '全部') return players;
    return players.filter(p => p.region === region);
  }, [region]);

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
          <span className="text-sm font-bold text-white/60">选手档案</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#FFD500] mb-6 drop-shadow-lg">选手档案</h1>

        {/* 赛区筛选 */}
        <div className="flex flex-wrap gap-3 mb-8">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-5 py-2 rounded-full font-bold transition-all duration-300 ${
                region === r
                  ? 'bg-[#FFD500] text-[#1A3A8A] shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <Link
              key={p.id}
              href={`/events/players/${p.id}`}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#FFD500]/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white/30">
                {p.name[0]}
              </div>
              <h3 className="text-xl font-black text-white text-center group-hover:text-[#FFD500] transition-colors mb-1">{p.name}</h3>
              <p className="text-xs text-white/50 text-center font-bold mb-1">{getTeamName(p.teamId)} · {p.role}</p>
              <p className="text-xs text-[#FFD500] text-center font-bold mb-4">{p.region}赛区</p>
              
              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-white/60">擅长英雄</div>
                <div className="flex flex-wrap gap-1">
                  {p.topHeroes.map(h => (
                    <span key={h} className="px-2 py-1 rounded bg-white/10 text-xs font-bold text-white">{h}</span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-sm font-black text-[#FFD500]">{(p.stats.winRate * 100).toFixed(0)}%</div>
                  <div className="text-[10px] text-white/50 font-bold">胜率</div>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-sm font-black text-white">{p.stats.totalKills}</div>
                  <div className="text-[10px] text-white/50 font-bold">击杀</div>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-sm font-black text-white">{p.stats.matches}</div>
                  <div className="text-[10px] text-white/50 font-bold">场次</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}