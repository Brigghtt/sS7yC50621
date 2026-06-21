'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { teams, players } from '@/lib/data/esports';
import Link from 'next/link';

function TeamLogo({ src, alt, className, fallback }: { src?: string; alt: string; className?: string; fallback?: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return <div className={`rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-4xl font-black text-white/30 ${className || ''}`}>{fallback || alt[0]}</div>;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-2xl object-contain bg-white/5 border border-white/10 ${className || ''}`}
      onError={() => setError(true)}
    />
  );
}

export default function TeamDetailPage() {
  const { id } = useParams();
  const team = teams.find(t => t.id === id);

  if (!team) {
    return (
      <main className="min-h-screen pt-32 text-center text-white">
        <h1 className="text-3xl font-black">战队未找到</h1>
        <Link href="/events/teams" className="text-[#FFD500] underline mt-4 inline-block">返回战队列表</Link>
      </main>
    );
  }

  const teamPlayers = players.filter(p => p.teamId === team.id);

  return (
    <main className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-[#154BCD] to-[#0f2a8a]">
      <div className="max-w-5xl mx-auto px-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/events" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm font-bold text-white hover:bg-[#FFD500] hover:text-[#1A3A8A] hover:border-[#FFD500] transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            返回赛事中心
          </Link>
          <span className="text-white/30">/</span>
          <Link href="/events/teams" className="text-sm font-bold text-white/60 hover:text-white transition-colors">战队档案</Link>
          <span className="text-white/30">/</span>
          <span className="text-sm font-bold text-white/60">{team.name}</span>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <TeamLogo src={team.logo} alt={team.name} className="w-24 h-24" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-1">{team.name}</h1>
              <p className="text-white/60 font-bold">{team.nameEn} · {team.region} · 成立于 {team.founded}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {team.style.map(s => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-[#FFD500]/15 border border-[#FFD500]/30 text-[#FFD500] text-sm font-bold">{s}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-[#FFD500]">{(team.stats.winRate * 100).toFixed(0)}%</div>
              <div className="text-xs text-white/50 font-bold">胜率</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">{team.stats.totalKills}</div>
              <div className="text-xs text-white/50 font-bold">总击杀</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">{team.stats.avgDamage}</div>
              <div className="text-xs text-white/50 font-bold">场均伤害</div>
            </div>
          </div>
          
          <h2 className="text-xl font-black text-white mb-4">历史战绩</h2>
          <div className="space-y-3">
            {team.history.map((h, i) => (
              <div key={i} className="flex items-center justify-between bg-black/20 rounded-xl p-4 border border-white/5">
                <div>
                  <div className="font-bold text-white">{h.event}</div>
                  <div className="text-xs text-white/50">{h.date}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                  h.result.includes('冠军') ? 'bg-[#FFD500] text-[#1A3A8A]' : 'bg-white/10 text-white'
                }`}>
                  {h.result}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10">
          <h2 className="text-xl font-black text-white mb-6">现役选手</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamPlayers.map(p => (
              <Link
                key={p.id}
                href={`/events/players/${p.id}`}
                className="flex items-center gap-4 bg-black/20 rounded-xl p-4 hover:bg-white/5 transition-colors border border-white/5"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-black text-white/30">
                  {p.name[0]}
                </div>
                <div>
                  <div className="font-bold text-white">{p.name}</div>
                  <div className="text-xs text-white/50">{p.role}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}