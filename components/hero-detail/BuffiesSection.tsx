'use client';

import type { HeroSkill } from '@/lib/data';
import SkillGrid from './SkillGrid';

interface BuffiesSectionProps {
  buffies: HeroSkill[];
}

export default function BuffiesSection({ buffies }: BuffiesSectionProps) {
  if (!buffies || buffies.length === 0) {
    return (
      <div className="text-white/60 text-center py-8 bg-white/5 rounded-xl border border-white/10">
        该英雄暂无芭菲强化
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-white/70 text-sm">
        芭菲是挂在英雄身上的强化挂件，可同时装备并增强随身妙具、星辉之力或极限充能的效果。
      </p>
      <SkillGrid items={buffies} />
    </div>
  );
}
