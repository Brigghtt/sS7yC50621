'use client';

import Link from 'next/link';
import { teams, type TournamentRegion } from '@/lib/data/esports';
import { useState, useMemo } from 'react';

function TeamLogo({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return <div className={`rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-black text-white/30 ${className || ''}`}>{alt[0]}</div>;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-xl object-contain bg-white/5 border border-white/10 ${className || ''}`}
      onError={() => setError(true)}
    />
  );
}

export default function TeamsPage() {
  const [region, setRegion] = useState<TournamentRegion | '全部'>('全部');
  const regions: (TournamentRegion | '全部')[] = ['全部', '欧洲', '东亚', '大陆'];

  const filtered = useMemo(() => {
    if (region === '全部') return teams;
    return teams.filter(t => t.region === region);
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
          <span className="text-sm font-bold text-white/60">战队档案</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-[#FFD500] mb-6 drop-shadow-lg">战队档案</h1>

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(team => (
            <Link
              key={team.id}
              href={`/events/teams/${team.id}`}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#FFD500]/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <TeamLogo src={team.logo} alt={team.name} className="w-16 h-16" />
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-[#FFD500] transition-colors">{team.name}</h3>
                  <p className="text-xs text-white/50 font-bold">{team.nameEn} · {team.region}赛区</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {team.style.map(s => (
                  <span key={s} className="px-2 py-1 rounded-md bg-white/10 text-xs font-bold text-white/80">{s}</span>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-lg font-black text-[#FFD500]">{(team.stats.winRate * 100).toFixed(0)}%</div>
                  <div className="text-[10px] text-white/50 font-bold">胜率</div>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-lg font-black text-white">{team.stats.totalKills}</div>
                  <div className="text-[10px] text-white/50 font-bold">总击杀</div>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="text-lg font-black text-white">{team.stats.avgDamage}</div>
                  <div className="text-[10px] text-white/50 font-bold">场均伤害</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}