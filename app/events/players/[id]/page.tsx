'use client';

import { useParams } from 'next/navigation';
import { players, teams } from '@/lib/data/esports';
import Link from 'next/link';

export default function PlayerDetailPage() {
  const { id } = useParams();
  const player = players.find(p => p.id === id);

  if (!player) {
    return (
      <main className="min-h-screen pt-32 text-center text-white">
        <h1 className="text-3xl font-black">选手未找到</h1>
        <Link href="/events/players" className="text-[#FFD500] underline mt-4 inline-block">返回选手列表</Link>
      </main>
    );
  }

  const team = teams.find(t => t.id === player.teamId);

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
          <Link href="/events/players" className="text-sm font-bold text-white/60 hover:text-white transition-colors">选手档案</Link>
          <span className="text-white/30">/</span>
          <span className="text-sm font-bold text-white/60">{player.name}</span>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 mb-8 text-center">
          <div className="w-28 h-28 rounded-full bg-white/10 border-2 border-white/20 mx-auto mb-4 flex items-center justify-center text-5xl font-black text-white/30">
            {player.name[0]}
          </div>
          <h1 className="text-3xl font-black text-white mb-1">{player.name}</h1>
          <p className="text-white/60 font-bold mb-6">
            {team?.name || '自由选手'} · {player.role}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-2xl font-black text-[#FFD500]">{(player.stats.winRate * 100).toFixed(0)}%</div>
              <div className="text-xs text-white/50 font-bold">胜率</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-2xl font-black text-white">{player.stats.totalKills}</div>
              <div className="text-xs text-white/50 font-bold">总击杀</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-2xl font-black text-white">{player.stats.avgDamage}</div>
              <div className="text-xs text-white/50 font-bold">场均伤害</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4">
              <div className="text-2xl font-black text-white">{player.stats.matches}</div>
              <div className="text-xs text-white/50 font-bold">总场次</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10">
          <h2 className="text-xl font-black text-white mb-4">擅长英雄 Top 5</h2>
          <div className="flex flex-wrap gap-3">
            {player.topHeroes.map((h, i) => (
              <div key={h} className="flex items-center gap-3 bg-black/20 rounded-xl px-5 py-3 border border-white/5">
                <span className="w-6 h-6 rounded-full bg-[#FFD500] text-[#1A3A8A] flex items-center justify-center text-xs font-black">{i + 1}</span>
                <span className="font-bold text-white">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}