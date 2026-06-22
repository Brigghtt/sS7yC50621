'use client';

import { GameMode } from '@/lib/data';
import { getBrawlifyModeIconUrl } from '@/lib/data/modeIconIds';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Props {
  mode: GameMode;
  modeId: string;
}

/* ── 模式格式推断 ── */
function getFormatInfo(modeId: string): { format: string; players: string } {
  if (modeId.includes('5v5') || modeId === 'wipeout') return { format: '5v5', players: '10人' };
  if (modeId === 'showdown') return { format: 'Solo / Duo / Trio', players: '1-3人' };
  if (modeId === 'duels' || modeId === 'brawlArena') return { format: '1v1', players: '2人' };
  return { format: '3v3', players: '6人' };
}

export default function ModeOverview({ mode, modeId }: Props) {
  const c = mode.color;
  const format = getFormatInfo(modeId);
  const brawlifyIcon = getBrawlifyModeIconUrl(modeId);
  const iconSrc = brawlifyIcon || `/Usedinmode/icon/${modeId}.png`;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── 模式简介（取第一段文字） ── */
  const brief = mode.sections[0]?.text || '';

  return (
    <section
      ref={ref}
      className={`py-12 md:py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto
        transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
    >
      <div
        className="relative rounded-2xl md:rounded-3xl overflow-hidden
          bg-gradient-to-br from-white/[0.07] to-white/[0.02]
          backdrop-blur-xl border border-white/[0.1]
          shadow-[0_6px_24px_rgba(0,0,0,0.25)]
          hover:border-white/[0.15]
          transition-all duration-500"
      >
        {/* ── 主题色光晕 ── */}
        <div
          className="absolute -top-20 -left-20 w-[300px] h-[300px] opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${c}33 0%, transparent 70%)`,
          }}
        />

        {/* ── 主内容 ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 p-6 md:p-8 lg:p-10">
          {/* 模式图标 */}
          <div
            className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden
              border-2 bg-white/10 backdrop-blur-sm flex items-center justify-center"
            style={{ borderColor: `${c}44` }}
          >
            <Image
              src={iconSrc}
              alt={mode.title}
              width={80}
              height={80}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
              unoptimized={brawlifyIcon ? true : false}
            />
          </div>

          {/* 文字信息 */}
          <div className="flex-1 min-w-0">
            {/* 标题行 */}
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-xl md:text-2xl font-black text-white">{mode.title}</h2>
              <span
                className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-60"
                style={{ color: c }}
              >
                {mode.en}
              </span>
            </div>

            {/* 标签行 */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="px-3 py-1 rounded-lg text-xs md:text-sm font-bold border"
                style={{ background: `${c}18`, borderColor: `${c}33`, color: c }}
              >
                {format.format}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs md:text-sm font-bold bg-white/10 border border-white/15 text-white/70">
                {format.players}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs md:text-sm font-bold bg-white/10 border border-white/15 text-white/70">
                {mode.sections.length} 个要点
              </span>
            </div>

            {/* 简介 */}
            <p className="text-sm md:text-base leading-relaxed text-white/60 line-clamp-3">
              {brief}
            </p>
          </div>

          {/* 右侧统计装饰（桌面端） */}
          <div className="hidden lg:flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `${c}18` }}>
              <span className="text-2xl font-black" style={{ color: c }}>
                {mode.sections.length}
              </span>
            </div>
            <span className="text-xs text-white/40 font-medium">特征要点</span>
          </div>
        </div>

        {/* ── 底部主题色渐变线 ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(to right, ${c}, ${c}44, transparent 80%)`,
          }}
        />
      </div>
    </section>
  );
}
