'use client';

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export default function FilterPill({ label, active, onClick, size = 'md' }: FilterPillProps) {
  const sizeClasses = size === 'sm'
    ? 'px-3.5 py-1.5 text-xs'
    : 'px-5 py-2 text-sm';

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses} rounded-full font-bold transition-all duration-300 whitespace-nowrap ${
        active
          ? 'bg-[#FFD500] text-[#1A3A8A] shadow-lg shadow-[#FFD500]/20 scale-105'
          : 'bg-white/[0.06] text-white/65 hover:bg-white/[0.12] hover:text-white/90 border border-transparent hover:border-white/[0.12]'
      }`}
    >
      {label}
    </button>
  );
}
