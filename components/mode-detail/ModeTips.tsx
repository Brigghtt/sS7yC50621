'use client';

import { ModeSection } from '@/lib/data';
import { useEffect, useRef, useState } from 'react';

interface Props {
  sections: ModeSection[];
  color: string;
}

/* ── 提取策略关键词 ── */
function extractTips(sections: ModeSection[]): string[] {
  return sections.map((s) => {
    // 取句子后半段（通常包含策略建议）
    const parts = s.text.split(/[，。,\.]/);
    const tipPart = parts.filter(p => p.trim().length > 5).pop() || s.text;
    return tipPart.trim();
  });
}

/* ── 策略图标映射 ── */
const tipIcons = ['💡', '⚡', '🎯', '🔥', '🛡️', '🏆'];

export default function ModeTips({ sections, color }: Props) {
  const tips = extractTips(sections);
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

  return (
    <section
      ref={ref}
      className={`py-12 md:py-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto
        transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
    >
      {/* ── 标题 ── */}
      <div className="flex items-center gap-3 mb-8 md:mb-12">
        <div className="w-1.5 h-8 md:h-10 rounded-full" style={{ background: color }} />
        <h2 className="text-2xl md:text-3xl font-black text-white">策略要点</h2>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold border"
          style={{ background: `${color}18`, borderColor: `${color}33`, color }}
        >
          TIPS
        </div>
      </div>

      {/* ── 卡片网格 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {tips.map((tip, i) => (
          <TipCard key={i} tip={tip} color={color} icon={tipIcons[i % tipIcons.length]} index={i} />
        ))}
      </div>
    </section>
  );
}

function TipCard({ tip, color, icon, index }: { tip: string; color: string; icon: string; index: number }) {
  return (
    <div
      className="group relative rounded-xl md:rounded-2xl overflow-hidden
        bg-gradient-to-br from-white/[0.06] to-white/[0.02]
        backdrop-blur-sm border border-white/[0.08]
        hover:border-white/[0.16]
        p-5 md:p-6
        shadow-[0_4px_16px_rgba(0,0,0,0.2)]
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.35),0_0_0_1px_${color}22]
        transition-all duration-500 ease-out
        hover:translate-y-[-2px]"
    >
      {/* ── 主题色光晕 ── */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl md:rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${color}15 0%, transparent 60%)`,
        }}
      />

      {/* ── 图标 + 序号 ── */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg md:text-xl">{icon}</span>
        <span
          className="px-2 py-0.5 rounded-md text-[10px] md:text-xs font-bold"
          style={{ background: `${color}18`, color }}
        >
          #{index + 1}
        </span>
      </div>

      {/* ── 文字 ── */}
      <p className="text-sm md:text-base leading-relaxed text-white/75 group-hover:text-white/90 transition-colors duration-300">
        {tip}
      </p>

      {/* ── 底部装饰线 ── */}
      <div
        className="mt-3 w-0 group-hover:w-full h-[2px] rounded-full transition-all duration-700 ease-out"
        style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
      />
    </div>
  );
}
