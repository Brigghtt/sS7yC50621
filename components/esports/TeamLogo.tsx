'use client';

import { useState } from 'react';

interface TeamLogoProps {
  src?: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24',
};

export default function TeamLogo({ src, alt, className = '', size = 'md' }: TeamLogoProps) {
  const [error, setError] = useState(false);
  const dims = sizeMap[size];

  if (!src || error) {
    return (
      <div
        className={`${dims} rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.08] flex items-center justify-center text-2xl font-black text-white/20 ${className}`}
      >
        {alt[0]}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${dims} rounded-2xl object-contain p-1 bg-white/[0.06] border border-white/[0.1] brightness-150 contrast-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.15)] ${className}`}
      onError={() => setError(true)}
    />
  );
}
