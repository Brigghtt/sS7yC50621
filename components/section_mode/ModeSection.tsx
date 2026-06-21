'use client';

import Image from 'next/image';
import Link from 'next/link';
import { modeCards, modeData } from '@/lib/data';
import { getBrawlifyModeIconUrl } from '@/lib/data/modeIconIds';

/* ── 从静态配置取素材 ── */
function getModeAsset(modeId: string) {
  const card = modeCards.find((c) => c.id === modeId);
  const meta = modeData[modeId];
  const brawlifyIcon = getBrawlifyModeIconUrl(modeId);
  return {
    title: card?.title || meta?.title || modeId,
    subTitle: card?.subTitle || meta?.en || modeId,
    logo: brawlifyIcon || card?.logo || '/Usedinmode/icon/icon1.png',
    bgImage: card?.bgImage || '/Usedinmode/mode1.png',
    color: meta?.color || '#007BFF',
  };
}

export default function ModeSection() {
  const allModes = modeCards;

  return (
    <section className="w-full h-screen relative overflow-hidden flex" id="mode">
      {/* 视差背景层 */}
      <div
        className="parallax-bg bg-cover bg-center absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/PromoArt/image2.png)',
          filter: 'blur(12px) brightness(0.25) saturate(0.5)',
        }}
      />

      {/* ===== 左侧黄条（与 MapSection 完全一致） ===== */}
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
          alt="游戏模式"
          className="relative z-5 w-[72px] h-[72px] mb-5 object-contain"
        />
        <h2
          className="relative z-5 font-black text-[#1A1A1A] leading-tight select-none"
          style={{ writingMode: 'vertical-rl', letterSpacing: '20px', fontSize: 'clamp(1.5rem, 3vw, 3rem)' }}
        >
          游戏模式
        </h2>
      </div>

      {/* ===== 右侧主内容区 ===== */}
      <div className="flex-1 h-full z-10 flex flex-col relative px-8 py-8 overflow-hidden">
        {/* 顶部说明 */}
        <div className="shrink-0 mb-5">
          <p className="text-zinc-300 text-sm font-bold">
            共 <span className="text-yellow-400 font-black text-lg">{allModes.length}</span> 种核心游戏模式，点击卡片查看详情
          </p>
        </div>

        {/* 模式网格：统一尺寸 */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
            {allModes.map((card) => (
              <ModeCard key={card.id} modeId={card.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   统一模式卡片
   ═══════════════════════════════════════════ */
function ModeCard({ modeId }: { modeId: string }) {
  const asset = getModeAsset(modeId);
  const themeColor = asset.color;

  const isDuels = modeId === 'duels';
  const topBarBg = isDuels
    ? 'linear-gradient(to right, #3991ef 23%, #d81c0f 23%)'
    : themeColor;

  const skewDeg = -4.5;

  return (
    <Link
      href={`/modes/${modeId}`}
      className="group block w-full aspect-[2.4/1]"
    >
      <div
        className="relative w-full h-full overflow-hidden rounded-xl border-[3px] border-white/10 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        style={{
          transform: `skewX(${skewDeg}deg)`,
          boxShadow: `0 6px 24px ${themeColor}30`,
        }}
      >
        {/* 背景图（反向矫正） */}
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{
            transform: `skewX(${-skewDeg}deg) scale(1.05)`,
            transformOrigin: 'center',
            backgroundImage: `url(${asset.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* 暗角遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* 内容层（反向矫正） */}
        <div
          className="relative z-10 w-full h-full flex flex-col"
          style={{ transform: `skewX(${-skewDeg}deg)` }}
        >
          {/* 顶部实色信息条：约占卡片高度 38% */}
          <div
            className="shrink-0 h-[38%] flex items-center gap-2 px-3"
            style={{ background: topBarBg }}
          >
            <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center shrink-0 border border-white/20">
              <Image
                src={asset.logo}
                alt=""
                width={26}
                height={26}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-base leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] truncate">
                {asset.title}
              </p>
              <p className="text-[11px] text-white/90 font-bold leading-tight truncate">
                {asset.subTitle}
              </p>
            </div>
          </div>

          {/* 底部图片区域：约占卡片高度 62% */}
          <div className="flex-1" />
        </div>
      </div>
    </Link>
  );
}
