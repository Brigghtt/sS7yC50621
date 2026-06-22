'use client';

import Image from 'next/image';
import { ModeSection } from '@/lib/data';
import { useEffect, useRef, useState } from 'react';

interface Props {
  sections: ModeSection[];
  color: string;
}

export default function ModeFeatureSections({ sections, color }: Props) {
  return (
    <div className="py-8 md:py-16 space-y-12 md:space-y-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      {sections.map((item, idx) => (
        <FeatureCard key={idx} item={item} color={color} index={idx} />
      ))}
    </div>
  );
}

/* ── 单个图文特征卡片 ── */
function FeatureCard({ item, color, index }: { item: ModeSection; color: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isReversed = item.align === 'left';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {/* ── 背景装饰 ── */}
      <div
        className="absolute -inset-4 opacity-[0.04] rounded-3xl pointer-events-none"
        style={{
          backgroundImage: `url(/Usedinmode/bgimage.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* ── 主卡片 ── */}
      <div
        className={`relative flex flex-col ${
          isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
        } items-stretch gap-6 md:gap-10
          rounded-2xl md:rounded-3xl overflow-hidden
          bg-gradient-to-br from-white/[0.08] to-white/[0.03]
          backdrop-blur-xl border border-white/[0.12]
          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]
          hover:border-white/[0.18]
          transition-all duration-500 ease-out
          group`}
      >
        {/* ── 主题色光条 ── */}
        <div
          className={`absolute top-0 ${
            isReversed ? 'right-0' : 'left-0'
          } w-[3px] md:w-[4px] h-full`}
          style={{
            background: `linear-gradient(180deg, ${color}, ${color}44, transparent)`,
          }}
        />

        {/* ── 图片区域 ── */}
        <div className="relative w-full md:w-[45%] lg:w-[50%] min-h-[220px] md:min-h-[320px] overflow-hidden">
          <Image
            src={item.img}
            alt={item.text.slice(0, 30)}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* 图片渐变遮罩 */}
          <div
            className="absolute inset-0"
            style={{
              background: isReversed
                ? `linear-gradient(to left, transparent 60%, rgba(0,0,0,0.4) 100%)`
                : `linear-gradient(to right, transparent 60%, rgba(0,0,0,0.4) 100%)`,
            }}
          />
          {/* 底部主题色条 */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{
              background: `linear-gradient(to right, ${color}, ${color}44, transparent)`,
            }}
          />

          {/* 序号标签 */}
          <div
            className="absolute top-4 left-4 md:top-6 md:left-6 w-8 h-8 md:w-10 md:h-10 rounded-xl
              flex items-center justify-center text-sm md:text-base font-black
              backdrop-blur-md border"
            style={{
              background: `${color}22`,
              borderColor: `${color}44`,
              color: color,
            }}
          >
            {index + 1}
          </div>
        </div>

        {/* ── 文字区域 ── */}
        <div className="flex-1 px-5 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10 flex flex-col justify-center">
          {/* 标签线 */}
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="w-8 md:w-12 h-[2px] rounded-full" style={{ background: color }} />
            <span
              className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-70"
              style={{ color }}
            >
              SECTION {index + 1}
            </span>
          </div>

          {/* 正文 */}
          <p className="text-base md:text-lg lg:text-xl leading-relaxed md:leading-relaxed text-white/85 font-medium">
            {item.text}
          </p>

          {/* 底部装饰线 */}
          <div
            className="mt-4 md:mt-6 w-16 md:w-24 h-[1px]"
            style={{ background: `linear-gradient(to right, ${color}66, transparent)` }}
          />
        </div>
      </div>
    </div>
  );
}
