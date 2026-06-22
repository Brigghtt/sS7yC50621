'use client';

import Image from 'next/image';
import { GameMode } from '@/lib/data';
import { getBrawlifyModeIconUrl } from '@/lib/data/modeIconIds';
import { useEffect, useState } from 'react';

interface Props {
  mode: GameMode;
  modeId: string;
}

/* ── 模式格式推断 ── */
function getFormatInfo(modeId: string): { format: string; players: string; icon: string } {
  if (modeId.includes('5v5') || modeId === 'wipeout') return { format: '5v5', players: '10人', icon: '⚔️' };
  if (modeId === 'showdown') return { format: '单人/双人/三人', players: '1-3人', icon: '🔥' };
  if (modeId === 'duels' || modeId === 'brawlArena') return { format: '1v1', players: '2人', icon: '🎯' };
  return { format: '3v3', players: '6人', icon: '🛡️' };
}

export default function ModeHero({ mode, modeId }: Props) {
  const c = mode.color;
  const brawlifyIcon = getBrawlifyModeIconUrl(modeId);
  const iconSrc = brawlifyIcon || `/Usedinmode/icon/${modeId}.png`;
  const format = getFormatInfo(modeId);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden select-none">
      {/* ── 背景图 ── */}
      <Image
        src={mode.sections[0]?.img || '/PromoArt/top.png'}
        alt={mode.title}
        fill
        className="object-cover scale-105"
        sizes="100vw"
        priority
      />

      {/* ── 动态主题色渐变遮罩 ── */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(180deg,
            ${c}15 0%,
            rgba(0,0,0,0.35) 30%,
            rgba(0,0,0,0.55) 60%,
            ${c}22 85%,
            ${c}44 100%
          )
        `,
      }} />

      {/* ── 顶部微弱光晕 ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30 animate-glow-pulse" style={{
        background: `radial-gradient(ellipse, ${c}55 0%, transparent 70%)`,
      }} />

      {/* ── 粒子装饰 ── */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-40 animate-float-idle"
            style={{
              background: c,
              left: `${15 + i * 14}%`,
              top: `${20 + i * 8}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3 + i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* ── 内容区 ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
        {/* 模式图标 */}
        <div
          className="relative mb-4 md:mb-6 transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ filter: `drop-shadow(0 8px 24px ${c}66)` }}
        >
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Image
              src={iconSrc}
              alt={mode.title}
              width={112}
              height={112}
              className="w-14 h-14 md:w-20 md:h-20 object-contain"
              unoptimized={brawlifyIcon ? true : false}
            />
          </div>
        </div>

        {/* 英文标题 */}
        <p
          className="text-sm md:text-base font-black uppercase tracking-[0.3em] mb-2 opacity-70"
          style={{ color: c }}
        >
          {mode.en}
        </p>

        {/* 中文标题 — 渐变文字 */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight"
          style={{
            background: `linear-gradient(135deg, #fff 0%, ${c} 50%, #fff 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
          }}
        >
          {mode.title}
        </h1>

        {/* 格式信息标签 */}
        <div className="mt-5 md:mt-8 flex items-center gap-3">
          <span
            className="px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md border"
            style={{
              background: `${c}22`,
              borderColor: `${c}44`,
              color: c,
            }}
          >
            {format.icon} {format.format}
          </span>
          <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-white/10 border border-white/20 text-white/80 backdrop-blur-md">
            {format.players}
          </span>
        </div>

        {/* 滚动提示 */}
        <div className={`mt-10 md:mt-14 transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-60'}`}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-white/50 tracking-widest">向下滚动</span>
            <div
              className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2"
            >
              <div
                className="w-1.5 h-1.5 rounded-full bg-white/60 animate-float-idle"
                style={{ animationDuration: '2s' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 底部渐变衔接 ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{
        background: `linear-gradient(to top, #0B0F1A 0%, transparent 100%)`,
      }} />
    </header>
  );
}
