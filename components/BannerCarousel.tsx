'use client';
import Swiper from '@/components/Swiper';

// 轮播图片数组
const bannerImages = [
  '/PromoArt/image1.png',
  '/PromoArt/image2.png',
  '/PromoArt/image3.png',
  '/PromoArt/image4.png',
  '/PromoArt/image5.png',
  '/PromoArt/image6.png',
  '/PromoArt/image7.png',
];

// 组装成 Swiper 需要的数据格式
const homeBannerList = bannerImages.map((src, idx) => ({
  id: idx + 1,
  bg: src,
}));

export default function BannerCarousel() {
  return (
    <div className="relative w-full h-screen overflow-hidden" id="banner">
      {/* 视差背景层 — 与前景内容反向移动 */}
      <div
        className="parallax-bg bg-cover bg-center"
        style={{
          backgroundImage: `url(${bannerImages[0]})`,
          filter: 'blur(8px) brightness(0.3)',
        }}
      />

      {/* 内容包裹层 — 参与淡入淡出过渡（仅 opacity，不做 transform 避免干扰 Swiper） */}
      <div className="snap-content-layer relative w-full h-full z-10">
        <Swiper
          list={homeBannerList}
          autoPlay={true}
          autoPlayInterval={2500}
          showArrow={true}
          showDots={true}
        />
      </div>
    </div>
  );
}
