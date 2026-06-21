'use client';

import { useState } from 'react';

interface GuideSectionProps {
  title: string;
  id?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  delay?: number;
}

export default function GuideSection({ title, id, defaultOpen = true, children, delay = 0 }: GuideSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={id} className="scroll-mt-24">
      <div
        className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-val-slam-up val-init-hidden"
        style={{ animationDelay: `${delay}s` }}
      >
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
        >
          <h2 className="text-2xl md:text-3xl font-black border-l-4 border-[#FFD500] pl-4 drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]">
            {title}
          </h2>
          <span
            className="text-[#FFD500] text-xl font-black transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▼
          </span>
        </button>
        {open && (
          <div className="px-6 pb-6 pt-2">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
