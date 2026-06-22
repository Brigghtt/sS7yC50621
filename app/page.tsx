'use client';

import BannerCarousel from '@/components/BannerCarousel';
import HeroSection from '@/components/section_hero/HeroSection';
import ModeSection from '@/components/section_mode/ModeSection';
import MapSection from '@/components/section_map/MapSection';
import ScrollIndicator from '@/components/ScrollIndicator';
import { useScrollSnapTransition } from '@/hooks/useScrollSnapTransition';

const SECTION_IDS = ['banner', 'hero', 'mode', 'map'];
const SECTION_LABELS = ['首页', '英雄', '模式', '地图'];

export default function Home() {
  // 驱动视差背景 + 内容淡入淡出过渡
  useScrollSnapTransition({
    sectionIds: SECTION_IDS,
    parallaxStrength: 0.12,        // 视差强度：背景层反向移动系数
    enableContentTransition: true,  // 启用内容淡入淡出 + 微缩放
  });

  return (
    <main className="relative z-10 w-full max-w-none">
      <BannerCarousel />
      <HeroSection />
      <ModeSection />
      <MapSection />

      {/* 右侧滚动进度指示器 */}
      <ScrollIndicator sectionIds={SECTION_IDS} labels={SECTION_LABELS} />
    </main>
  );
}
