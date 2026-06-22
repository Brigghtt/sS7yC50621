'use client';

import Image from 'next/image';
import type { HeroSkin } from '@/lib/data';
import { localizeHeroText, cleanHeroText } from '@/lib/i18n';

interface SkinSectionProps {
  skins: HeroSkin[];
}

export default function SkinSection({ skins }: SkinSectionProps) {
  if (!skins || skins.length === 0) {
    return (
      <div className="text-white/60 text-center py-8 bg-white/5 rounded-xl border border-white/10">
        皮肤数据正在整理中，敬请期待
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {skins.map((skin, idx) => (
        <div
          key={idx}
          className="bg-white/10 rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-all text-center"
        >
          <div className="relative aspect-square mb-2">
            <Image
              src={skin.image}
              alt={skin.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <p className="text-sm font-bold truncate">{cleanHeroText(localizeHeroText(skin.name))}</p>
        </div>
      ))}
    </div>
  );
}
