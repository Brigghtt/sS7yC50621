'use client';

export default function PageHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#FFD500]/10 border border-[#FFD500]/20 flex items-center justify-center text-xl">
            {icon}
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-black text-[#FFD500] drop-shadow-lg">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-white/45 font-bold text-sm md:text-base ml-13">{subtitle}</p>
      )}
    </div>
  );
}
