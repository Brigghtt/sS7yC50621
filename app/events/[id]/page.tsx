'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { tournaments } from '@/lib/data/esports';
import Link from 'next/link';

function TeamLogo({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return <div className={`rounded-full bg-white/10 border-2 border-white/20 ${className || ''}`} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-contain bg-white/5 ${className || ''}`}
      onError={() => setError(true)}
    />
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const t = tournaments.find(x => x.id === id);

  if (!t) {
    return (
      <main className="min-h-screen pt-32 text-center text-white">
        <h1 className="text-3xl font-black">赛事未找到</h1>
        <Link href="/events" className="text-[#FFD500] underline mt-4 inline-block">返回赛事中心</Link>
      </main>
    );
  }

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
          <span className="text-sm font-bold text-white/60">赛事详情</span>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full bg-[#FFD500] text-[#1A3A8A] text-xs font-black`}>{t.category}</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold">{t.format}</span>
            <span className="text-xs text-white/50 font-mono">{t.version}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t.name}</h1>
          <p className="text-white/60 font-bold mb-8">{t.date}</p>
          
          <div className="flex items-center justify-center gap-6 md:gap-10 bg-black/20 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col items-center gap-3">
              <TeamLogo src={t.teamA.logo} alt={t.teamA.name} className="w-16 h-16 md:w-20 md:h-20" />
              <span className="text-lg md:text-xl font-black text-white">{t.teamA.name}</span>
              <span className="text-xs text-white/50">{t.teamA.nameEn}</span>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-[#FFD500] mb-1">{t.score}</div>
              <div className="text-xs font-bold text-white/50">FINAL</div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <TeamLogo src={t.teamB.logo} alt={t.teamB.name} className="w-16 h-16 md:w-20 md:h-20" />
              <span className="text-lg md:text-xl font-black text-white">{t.teamB.name}</span>
              <span className="text-xs text-white/50">{t.teamB.nameEn}</span>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD500]/15 border border-[#FFD500]/30 text-[#FFD500] font-black text-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFD500]" />
              胜者: {t.winner === 'A' ? t.teamA.name : t.teamB.name}
            </span>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 mb-8">
          <h2 className="text-2xl font-black text-white mb-6">对局详情</h2>
          <div className="space-y-4">
            {t.matches.map((m, idx) => (
              <div key={idx} className="bg-black/20 rounded-xl p-4 md:p-5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#FFD500]">{m.mode}</span>
                  <span className="text-xs text-white/50">{m.map}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className={`flex-1 text-center p-3 rounded-lg border ${m.teamA.win ? 'bg-[#FFD500]/10 border-[#FFD500]/40' : 'bg-white/5 border-white/10'}`}>
                    <div className="text-xs text-white/60 mb-2">{t.teamA.name}</div>
                    <div className="flex justify-center gap-1 flex-wrap">
                      {m.teamA.heroes.map(h => (
                        <span key={h} className="px-2 py-1 rounded bg-white/10 text-xs font-bold text-white">{h}</span>
                      ))}
                    </div>
                    {m.teamA.win && <div className="mt-2 text-xs font-black text-[#FFD500]">WIN</div>}
                  </div>
                  <div className="text-white/30 font-black">VS</div>
                  <div className={`flex-1 text-center p-3 rounded-lg border ${m.teamB.win ? 'bg-[#FFD500]/10 border-[#FFD500]/40' : 'bg-white/5 border-white/10'}`}>
                    <div className="text-xs text-white/60 mb-2">{t.teamB.name}</div>
                    <div className="flex justify-center gap-1 flex-wrap">
                      {m.teamB.heroes.map(h => (
                        <span key={h} className="px-2 py-1 rounded bg-white/10 text-xs font-bold text-white">{h}</span>
                      ))}
                    </div>
                    {m.teamB.win && <div className="mt-2 text-xs font-black text-[#FFD500]">WIN</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {t.videoUrl && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl font-black text-white mb-4">视频回放</h2>
            <a
              href={t.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#FFD500] text-[#1A3A8A] font-black hover:scale-105 transition-transform"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              观看回放
            </a>
          </div>
        )}
      </div>
    </main>
  );
}