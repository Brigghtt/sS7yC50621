'use client';

import { useEffect, useState } from 'react';

interface ScrollIndicatorProps {
  /** section ID 列表，按页面顺序 */
  sectionIds: string[];
  /** 圆点标签（可选），默认使用 sectionIds 的首字母大写 */
  labels?: string[];
}

/**
 * 滚动进度指示器 — 固定在页面右侧的圆点导航
 *
 * 通过监听 body 上的 data-active-section 属性来高亮当前圆点，
 * 点击圆点可滚动到对应 section。
 */
export default function ScrollIndicator({ sectionIds, labels }: ScrollIndicatorProps) {
  const [activeId, setActiveId] = useState<string>(() => {
    if (typeof document !== 'undefined') {
      return document.body.getAttribute('data-active-section') || sectionIds[0] || '';
    }
    return sectionIds[0] || '';
  });

  useEffect(() => {
    // 使用 MutationObserver 监听 body 的 data-active-section 属性变化
    const observer = new MutationObserver(() => {
      const current = document.body.getAttribute('data-active-section');
      if (current) {
        setActiveId(current);
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-active-section'],
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (sectionIds.length === 0) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-45 flex flex-col gap-3 max-md:hidden" aria-label="页面导航">
      {sectionIds.map((id, idx) => (
        <button
          key={id}
          onClick={() => handleClick(id)}
          className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-350 border-2 ${
            id === activeId
              ? 'bg-[#FFD500] border-[#FFD500] shadow-[0_0_12px_rgba(255,213,0,0.6)] scale-140 hover:scale-150'
              : 'bg-white/35 border-white/60 hover:bg-white/70 hover:border-white hover:scale-120'
          }`}
          aria-label={labels?.[idx] ?? `第 ${idx + 1} 页`}
          title={labels?.[idx] ?? `第 ${idx + 1} 页`}
          style={{ transitionTimingFunction: 'var(--scroll-easing, cubic-bezier(0.4,0,0.2,1))' }}
        />
      ))}
    </div>
  );
}
