'use client';

interface StatCardProps {
  value: string;
  label: string;
  highlight?: boolean;
  className?: string;
}

export default function StatCard({ value, label, highlight, className = '' }: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-3.5 text-center transition-all duration-300 ${
        highlight
          ? 'bg-gradient-to-br from-[#FFD500]/15 to-[#FFD500]/5 border border-[#FFD500]/20'
          : 'bg-black/30 backdrop-blur-sm border border-white/[0.08]'
      } hover:border-[#FFD500]/25 hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] ${className}`}
    >
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD500]/5 to-transparent pointer-events-none" />
      )}
      <div className={`relative text-xl md:text-2xl font-black ${highlight ? 'text-[#FFD500]' : 'text-white'}`}>
        {value}
      </div>
      <div className="relative text-[11px] font-bold text-white/60 mt-0.5 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
