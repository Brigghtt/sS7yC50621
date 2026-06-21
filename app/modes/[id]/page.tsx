'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { modeData } from '@/lib/data';

/**
 * 预留视觉素材：
 * - 模式 Banner：/public/mode-banner/{modeId}.jpg（1920x600，每种模式一张）
 * - 模式说明配图：/public/mode-section/{modeId}-{1-3}.jpg（800x500）
 *   当前 showdown 模式使用 /Usedinmode/ 下的图片，其他模式需补充
 */

export default function ModeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const mode = modeData[id as keyof typeof modeData];

  if (!mode) {
    return <div className="h-screen flex items-center justify-center text-white text-3xl">模式不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5B21B6] via-[#7C3AED] to-[#4C1D95] text-white">

      {/* 顶部美宣图 */}
      <div className="relative w-full h-[60vh]">
        <Image
          src="/PromoArt/top.png"
          alt={mode.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#4C1D95]"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-7xl font-black mt-2">
            {mode.title}
          </h1>
          <p className="text-white/70 text-lg tracking-widest">{mode.en}</p>
        </div>
      </div>

      {/* 图文卡片区域 */}
      <div className="py-20 space-y-24">
        {mode.sections.map((item, idx) => (
          <div key={idx}>
            <div
              className={`relative flex w-full ${
                item.align === "right" ? "justify-end" : "justify-start"
              }`}
            >
              {/* 背景图（底层，不遮挡内容） */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15"
                style={{ backgroundImage: `url(/Usedinmode/bgimage.png)` }}
              />

              {/* 图文盒子 */}
              <div className={`flex flex-col md:flex-row ${item.align === "right" ? "md:flex-row-reverse" : ""} items-center gap-10 w-[85%] h-[500px] bg-white/10 rounded-2xl p-8 backdrop-blur-md border border-white/30 shadow-xl`}>
                <div className="w-full md:w-1/2 h-full rounded-xl overflow-hidden border-2 border-white/20 shadow-lg hover:border-[#FFD500] transition-all duration-300 relative">
                  <Image src={item.img} alt={item.text.slice(0, 20)} fill className="object-cover" sizes="50vw" />
                </div>
                <div className="w-full md:w-1/2 text-xl leading-relaxed px-4">
                  {item.text}
                </div>
              </div>
            </div>

            {/* Section 分隔线 */}
            {idx < mode.sections.length - 1 && (
              <div className="w-[60%] mx-auto h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-24"></div>
            )}
          </div>
        ))}
      </div>

      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="fixed bottom-10 left-10 px-6 py-3 bg-[#FFD500] text-black font-bold rounded-xl shadow-lg z-50 hover:scale-105 hover:shadow-[0_5px_20px_rgba(255,213,0,0.4)] transition-all duration-300"
      >
        ← 返回
      </button>
    </div>
  );
}
