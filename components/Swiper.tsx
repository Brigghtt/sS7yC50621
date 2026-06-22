'use client';
import { useState, useEffect, useRef, useCallback, ReactNode } from 'react';

export type SwiperItem = {
  id: number;
  bg?: string;
  [key: string]: unknown;
};

type SwiperProps<T extends SwiperItem = SwiperItem> = {
  list: T[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrow?: boolean;
  showDots?: boolean;
  renderContent?: (item: T) => ReactNode;
};

export default function Swiper<T extends SwiperItem = SwiperItem>({
  list,
  autoPlay = true,
  autoPlayInterval = 2500,
  showArrow = true,
  showDots = true,
  renderContent,
}: SwiperProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const TRANSITION_DURATION = 600;
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

  const currentIndexRef = useRef(currentIndex);
  const isTransitioningRef = useRef(isTransitioning);
  const listLengthRef = useRef(list.length);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);
  useEffect(() => { listLengthRef.current = list.length; }, [list.length]);

  // 自动播放
  useEffect(() => {
    if (!autoPlay || list.length <= 1) return;

    timerRef.current = setInterval(() => {
      if (isTransitioningRef.current) return;
      if (listLengthRef.current <= 1) return;

      const next = (currentIndexRef.current + 1) % listLengthRef.current;

      setCurrentIndex(next);
      setIsTransitioning(true);
      currentIndexRef.current = next;
      isTransitioningRef.current = true;

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
        isTransitioningRef.current = false;
      }, TRANSITION_DURATION);
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoPlay, autoPlayInterval, list.length]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const goTo = useCallback(
    (newIndex: number) => {
      if (newIndex === currentIndexRef.current || isTransitioningRef.current) return;

      setCurrentIndex(newIndex);
      setIsTransitioning(true);
      currentIndexRef.current = newIndex;
      isTransitioningRef.current = true;

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
        isTransitioningRef.current = false;
      }, TRANSITION_DURATION);
    },
    []
  );

  const goToPrev = () => goTo((currentIndex - 1 + list.length) % list.length);
  const goToNext = () => goTo((currentIndex + 1) % list.length);

  const current = list[currentIndex];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ── 所有背景图层始终渲染，通过 opacity 交叉淡入淡出，无 scale 抖动 ── */}
      <div className="absolute inset-0">
        {list.map((item, idx) => {
          const isCurrent = idx === currentIndex;
          const opacity = isCurrent ? 1 : 0;

          return (
            <div
              key={item.id}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: item.bg ? `url(${item.bg})` : undefined,
                opacity,
                transition: `opacity ${TRANSITION_DURATION}ms ${EASING}`,
              }}
            />
          );
        })}
      </div>

      {/* ── 自定义内容渲染 ── */}
      {renderContent && (
        <div
          className="relative z-10"
          style={{
            transition: `opacity ${TRANSITION_DURATION}ms ${EASING}`,
          }}
        >
          {renderContent(current)}
        </div>
      )}

      {/* 左右箭头 */}
      {showArrow && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-[#FFD500] transition-all duration-200 flex items-center justify-center text-white hover:text-black z-20"
            aria-label="上一张"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-[#FFD500] transition-all duration-200 flex items-center justify-center text-white hover:text-black z-20"
            aria-label="下一张"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* 底部圆点指示器 */}
      {showDots && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {list.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-[#FFD500] w-4'
                  : 'bg-white/50 w-2 hover:bg-white/80'
              }`}
              aria-label={`第 ${idx + 1} 张`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
