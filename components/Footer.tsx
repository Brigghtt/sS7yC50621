// app/components/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { navMenus } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0f2a8a]/95 backdrop-blur-md border-t-4 border-[#FFD500] text-white overflow-hidden">
      {/* 顶部黄色装饰条 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD500] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* ===== 左侧：品牌区 ===== */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/glo/logo.png"
                  alt="荒野乱斗"
                  fill
                  className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
                  sizes="56px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-wide text-[#FFD500] drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                  荒野乱斗
                </span>
                <span className="text-xs font-bold text-white/60 tracking-widest uppercase">
                  Brawl Stars
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              非官方粉丝向资料站，提供英雄图鉴、游戏模式与对战地图查询。数据仅供参考，请以游戏内实际内容为准。
            </p>

            {/* 小型导航（移动端显示，桌面端隐藏） */}
            <div className="flex flex-wrap gap-3 md:hidden">
              {navMenus.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-sm font-bold text-white/80 hover:bg-[#FFD500] hover:text-[#1A3A8A] transition-all duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* ===== 中间：导航链接 ===== */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-lg font-black text-[#FFD500] mb-4 tracking-wide">
              快速导航
            </h3>
            <ul className="flex flex-col gap-2.5">
              {navMenus.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="group flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD500]/50 group-hover:bg-[#FFD500] transition-colors duration-300" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== 右侧：关于/声明 ===== */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-black text-[#FFD500] mb-4 tracking-wide">
              关于本站
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm font-bold text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-[#FFD500] mt-0.5">•</span>
                <span>基于 Next.js 16 + Tailwind CSS v4 构建</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD500] mt-0.5">•</span>
                <span>仅供学习交流使用</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD500] mt-0.5">•</span>
                <span>数据更新至 2026 赛季</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== 分隔线 ===== */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ===== 底部：版权与免责声明 ===== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50 font-medium">
          <div className="text-center md:text-left leading-relaxed">
            <p>
              © 2026 荒野乱斗资料站 · 非官方网站
            </p>
            <p className="mt-1">
              Brawl Stars 及其相关素材版权归 
              <span className="text-[#FFD500]/80 font-bold"> Supercell Oy </span> 
              所有。本站与 Supercell 无任何关联，所有内容仅供学习交流。
            </p>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold tracking-wider">
              FAN MADE
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold tracking-wider">
              NOT OFFICIAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
