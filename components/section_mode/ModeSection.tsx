'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
    desc: (card && 'desc' in card ? (card as { desc: string }).desc : '') || '',
    logo: brawlifyIcon || card?.logo || '/Usedinmode/icon/icon1.png',
    bgImage: card?.bgImage || '/Usedinmode/mode1.png',
    color: meta?.color || '#007BFF',
  };
}

const V5_MODE_IDS = new Set(['gemgrab5v5', 'brawlball5v5', 'knockout5v5']);

export default function ModeSection() {
  const allModes = modeCards;
  const modes3v3 = allModes.filter((c) => !V5_MODE_IDS.has(c.id));
  const modes5v5 = allModes.filter((c) => V5_MODE_IDS.has(c.id));

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
      <div className="flex-1 h-full z-10 flex flex-col relative px-4 sm:px-6 md:px-8 py-6 md:py-8 overflow-hidden">
        {/* 顶部说明 — 简洁克制，与左黄条品牌呼应但不过度 */}
        <div className="shrink-0 mb-4 md:mb-6">
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-white/85 text-sm md:text-base font-extrabold tracking-wide">
              核心游戏模式
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-white/50 text-[11px] font-semibold">
              {allModes.length}
            </span>
          </div>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 ml-0.5">
            点击卡片查看详情与实时轮换信息
          </p>
        </div>

        {/* 模式网格 */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
          {/* 3v3 模式 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-6">
            {modes3v3.map((card) => (
              <ModeCard key={card.id} modeId={card.id} />
            ))}
          </div>

          {/* 5v5 模式：卡片更高、每行更少，形成区分度 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-4 bg-[#FFD500] rounded-full" />
            <h4 className="text-white/90 text-sm font-black">5v5 模式</h4>
            <span className="text-xs text-white/40 font-bold">更激烈的团队对抗</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 pb-6 md:pb-8">
            {modes5v5.map((card) => (
              <ModeCard key={card.id} modeId={card.id} is5v5 />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   模式卡片 — 标题锚定上方·叠加背景图·底部极简 CTA
   ── icon + 标题/副标题 上方叠加 / CTA 右下 / 中下留空展现背景
   ═══════════════════════════════════════════ */
function ModeCard({ modeId, is5v5 = false }: { modeId: string; is5v5?: boolean }) {
  const asset = getModeAsset(modeId);
  const c = asset.color;
  const [logoSrc, setLogoSrc] = useState(asset.logo);
  const [logoError, setLogoError] = useState(false);

  // Brawlify 图标加载失败时回退到本地图标
  const handleLogoError = () => {
    if (logoError) return;
    setLogoError(true);
    const card = modeCards.find((item) => item.id === modeId);
    const fallback = card?.logo || '/Usedinmode/icon/icon1.png';
    if (fallback !== logoSrc) setLogoSrc(fallback);
  };

  return (
    <Link
      href={`/modes/${modeId}`}
      className={`group block w-full ${is5v5 ? 'aspect-[2/1]' : 'aspect-[5/2]'}`}
    >
      <div
        className={`relative w-full h-full rounded-2xl overflow-hidden transition-all duration-500 ease-out
          hover:scale-[1.03] hover:-translate-y-1.5
          border-2 hover:border-white/25
          shadow-[0_4px_16px_rgba(0,0,0,0.45)]
          hover:shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)]
          ${is5v5 ? 'border-[#FFD500]/40' : 'border-white/8'}`}
      >
        {/* 5v5 角标 */}
        {is5v5 && (
          <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded bg-[#FFD500] text-[#1A1A1A] text-[10px] font-black shadow-lg">
            5v5
          </div>
        )}

        {/* ── 悬浮辉光（模式主题色，收束在上方标题区附近） ── */}
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 20% 25%, ${c}1A 0%, transparent 50%)` }}
        />

        {/* ── 背景图 ── */}
        <Image
          src={asset.bgImage}
          alt=""
          fill
          unoptimized
          className="absolute inset-0 z-[1] transition-transform duration-700 ease-out group-hover:scale-110 object-cover object-center"
        />

        {/* ── 遮罩：上方加暗承载文字，中下通透展现背景 ── */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background: `linear-gradient(
              180deg,
              rgba(0,0,0,0.65) 0%,
              rgba(0,0,0,0.45) 20%,
              rgba(0,0,0,0.15) 45%,
              rgba(0,0,0,0.02) 65%,
              rgba(0,0,0,0.15) 85%,
              rgba(0,0,0,0.45) 100%
            )`,
          }}
        />

        {/* ═══════════════════════════════════════
            ▶ 上方 — 图标 + 标题 + 副标题，叠加在背景图上（加大尺寸与间距）
           ═══════════════════════════════════════ */}
        <div className="absolute top-0 left-0 right-0 z-[3] px-4 sm:px-5 pt-5 sm:pt-6 md:pt-7 pb-2">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* 图标 */}
            <Image
              src={logoSrc}
              alt=""
              width={64}
              height={64}
              onError={handleLogoError}
              className="object-contain w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0
                drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)]
                transition-transform duration-500 ease-out
                group-hover:scale-115 group-hover:drop-shadow-[0_5px_16px_rgba(0,0,0,0.8)]"
              unoptimized
            />
            {/* 标题 + 副标题 */}
            <div className="min-w-0 flex-1">
              <h4
                className="text-white font-black text-base sm:text-lg md:text-xl lg:text-[1.35rem]
                  leading-[1.15] tracking-tight
                  drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_5px_14px_rgba(0,0,0,0.95)]
                  transition-all duration-300
                  break-words"
                style={{ WebkitTextStroke: '0.5px rgba(0,0,0,0.2)' }}
              >
                {asset.title}
              </h4>
              {/* 副标题：accent 线 + 英文名 */}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="block w-5 sm:w-6 h-[2.5px] rounded-full shrink-0 opacity-80"
                  style={{ background: c }}
                />
                <p
                  className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.1em]
                    drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                  style={{ color: `${c}` }}
                >
                  {asset.subTitle}
                </p>
              </div>
              {/* 描述（悬浮渐显） */}
              {asset.desc && (
                <p
                  className="text-[10px] sm:text-[11px] text-white/0 font-medium leading-snug
                    max-w-[85%]
                    opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-10
                    transition-all duration-400 ease-out overflow-hidden
                    group-hover:text-white/70
                    drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] mt-1"
                >
                  {asset.desc}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            ▶ 右下角 — CTA 悬浮渐显
           ═══════════════════════════════════════ */}
        <span
          className="absolute bottom-2.5 sm:bottom-3 right-3 sm:right-4 z-[3]
            shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-500
            px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full
            text-[10px] sm:text-[11px] font-bold
            bg-white/10 backdrop-blur-sm
            hover:scale-105 hover:bg-white/15"
          style={{ color: c, border: `1.5px solid ${c}66` }}
        >
          查看详情 →
        </span>

        {/* ── 底部指示条（模式主题色渐变） ── */}
        <div
          className="absolute bottom-0 left-0 z-[4] h-[2.5px] rounded-r-full
            transition-all duration-500 ease-out group-hover:h-[3.5px]
            w-[30%] group-hover:w-[60%]"
          style={{
            background: `linear-gradient(to right, ${c}, ${c}66, transparent)`,
          }}
        />
      </div>
    </Link>
  );
}
