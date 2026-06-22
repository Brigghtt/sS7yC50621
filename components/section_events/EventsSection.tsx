'use client';

import Link from 'next/link';

const EVENT_ENTRIES = [
  { id: 'events', href: '/events', label: '赛事中心', sub: '赛事档案与对阵数据', icon: '🏆' },
  { id: 'players', href: '/events/players', label: '选手档案', sub: '职业选手数据与擅长英雄', icon: '👤' },
  { id: 'teams', href: '/events/teams', label: '战队档案', sub: '职业战队战绩与阵容', icon: '🛡️' },
  { id: 'stats', href: '/events/stats', label: '数据洞察', sub: '英雄 BP 与版本趋势', icon: '📊' },
  { id: 'schedule', href: '/events/schedule', label: '赛程日历', sub: '赛事直播与历史赛程', icon: '📅' },
];

export default function EventsSection() {
  return (
    <section id="events" className="w-full min-h-screen relative overflow-hidden flex bg-gradient-to-b from-[#154BCD] to-[#0f2a8a]">
      {/* ===== 左侧黄条 ===== */}
      <div
        className="relative w-[140px] shrink-0 flex flex-col items-center justify-center overflow-visible select-none h-screen z-10"
        style={{
          background: 'linear-gradient(180deg, #FFE135 0%, #FFD500 12%, #FFC300 40%, #FFB800 70%, #FFA800 100%)',
          boxShadow: '5px 0 0 rgba(0,0,0,0.1), 6px 0 14px rgba(0,0,0,0.08)',
          borderRadius: '0 12px 12px 0',
        }}
      >
        <img
          src="/glo/logo2.png"
          alt="赛事中心"
          className="relative z-5 w-[72px] h-[72px] mb-5 object-contain"
        />
        <h2
          className="relative z-5 font-black text-[#1A1A1A] leading-tight select-none"
          style={{ writingMode: 'vertical-rl', letterSpacing: '20px', fontSize: 'clamp(1.5rem, 3vw, 3rem)' }}
        >
          赛事中心
        </h2>
      </div>

      {/* ===== 右侧主内容区 ===== */}
      <div className="flex-1 min-h-screen z-10 flex flex-col relative px-4 sm:px-6 md:px-8 py-6 md:py-8 overflow-hidden">
        <div className="shrink-0 mb-6 md:mb-8">
          <h3 className="text-white/85 text-sm md:text-base font-extrabold tracking-wide">
            赛事入口
          </h3>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            点击卡片进入对应赛事页面
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-0 overflow-y-auto custom-scrollbar snap-align-none pr-1 sm:pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl">
            {EVENT_ENTRIES.map((entry) => (
              <Link
                key={entry.id}
                href={entry.href}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8
                  hover:border-[#FFD500]/40 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1
                  shadow-[0_4px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
              >
                {/* 顶部悬浮辉光 */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(255,213,0,0.08) 0%, transparent 55%)' }}
                />

                <div className="relative z-10 flex items-center gap-4">
                  <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                    {entry.icon}
                  </span>
                  <div>
                    <h4 className="text-white font-black text-xl md:text-2xl group-hover:text-[#FFD500] transition-colors">
                      {entry.label}
                    </h4>
                    <p className="text-white/50 text-xs md:text-sm font-bold mt-1">
                      {entry.sub}
                    </p>
                  </div>
                </div>

                {/* 底部指示条 */}
                <div className="absolute bottom-0 left-0 h-[2.5px] rounded-r-full bg-[#FFD500] w-[25%] group-hover:w-[55%] transition-all duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
