'use client';

import Image from 'next/image';

interface PinsSectionProps {
  pins: string[];
}

export default function PinsSection({ pins }: PinsSectionProps) {
  if (!pins || pins.length === 0) {
    return (
      <div className="text-white/60 text-center py-8 bg-white/5 rounded-xl border border-white/10">
        该英雄暂无表情数据
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {pins.map((src, idx) => (
        <Image
          key={idx}
          src={src}
          alt={`表情-${idx}`}
          width={80}
          height={80}
          className="!w-16 !h-16 md:!w-20 md:!h-20 object-contain flex-shrink-0 bg-white/10 rounded-lg border border-white/10 hover:scale-110 transition-transform"
          unoptimized
        />
      ))}
    </div>
  );
}
