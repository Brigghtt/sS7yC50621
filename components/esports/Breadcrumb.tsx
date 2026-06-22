'use client';

import Link from 'next/link';

interface CrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: CrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 mb-6 flex-wrap" aria-label="面包屑导航">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm font-bold text-white/70 hover:bg-[#FFD500] hover:text-[#1A3A8A] hover:border-[#FFD500] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(255,213,0,0.25)]"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        赛事中心
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          <span className="text-white/20 font-bold select-none">/</span>
          {item.href ? (
            <Link
              href={item.href}
              className="text-sm font-bold text-white/50 hover:text-white/80 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-bold text-white/40">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
