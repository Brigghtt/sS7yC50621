'use client';

import Image from 'next/image';
import type { HeroSkill } from '@/lib/data';

interface SkillGridProps {
  items: HeroSkill[];
  emptyText?: string;
}

export default function SkillGrid({ items, emptyText = '暂无数据' }: SkillGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-white/60 text-center py-8 bg-white/5 rounded-xl border border-white/10">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((item, idx) => (
        <div
          key={item.id ?? idx}
          className="flex gap-4 bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-4 border border-white/10 hover:from-white/15 hover:to-white/10 transition-all hover:scale-[1.01]"
        >
          <Image
            src={item.icon}
            alt={item.name}
            width={80}
            height={80}
            className="!w-20 !h-20 flex-shrink-0 object-contain rounded-md bg-black/20"
            unoptimized
          />
          <div className="min-w-0">
            <h4 className="text-lg font-black text-[#FFD500] mb-1 truncate">{item.name}</h4>
            <p className="text-white/85 text-sm leading-relaxed">{item.desc || '暂无描述'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
