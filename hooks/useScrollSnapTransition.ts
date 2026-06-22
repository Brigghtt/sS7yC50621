'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * 滚动吸附过渡增强 Hook（性能优化版）
 *
 * 功能：
 * 1. 监听各 section 的 IntersectionObserver 可见比例，
 *    实时更新 CSS 自定义属性实现 section 切换时的淡入淡出 + 微缩放。
 * 2. 监听滚动位置，更新视差层的 --parallax-y。
 * 3. 返回当前活跃 section ID，供滚动进度指示器使用。
 *
 * 优化点：
 * - 预先缓存 contentLayer / parallax 元素，避免在滚动循环中反复 querySelector。
 * - IntersectionObserver 阈值精简，且避免重复 setState / setAttribute。
 * - 视差更新使用 requestAnimationFrame + 时间节流，降低重绘压力。
 */

export interface UseScrollSnapTransitionOptions {
  /** section ID 列表，按页面顺序排列 */
  sectionIds: string[];
  /** 视差强度：背景层相对于滚动位置的偏移系数，默认 0.12 */
  parallaxStrength?: number;
  /** 是否启用内容淡入淡出过渡，默认 true */
  enableContentTransition?: boolean;
}

export interface UseScrollSnapTransitionReturn {
  /** 当前最可见的 section ID */
  activeSection: string;
  /** 手动跳转到指定 section（使用 scrollIntoView） */
  scrollToSection: (id: string) => void;
}

export function useScrollSnapTransition({
  sectionIds,
  parallaxStrength = 0.12,
  enableContentTransition = true,
}: UseScrollSnapTransitionOptions): UseScrollSnapTransitionReturn {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');
  // 用 ref 记录当前激活 section，避免 observer 频繁触发时重复 setState
  const activeSectionRef = useRef<string>(activeSection);

  // ========================================================
  // 1. IntersectionObserver — 驱动内容淡入淡出 + 缩放
  // ========================================================
  useEffect(() => {
    if (sectionIds.length === 0 || !enableContentTransition) return;

    const sectionEls: HTMLElement[] = [];
    const contentLayerMap = new Map<string, HTMLElement>();

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      sectionEls.push(el);

      // snap-free 的 section 不参与吸附过渡效果，保持自然滚动
      if (el.classList.contains('snap-free')) continue;

      // 预先查找 content layer，避免 observer 回调中反复 querySelector
      let layer = el.querySelector(':scope > .snap-content-layer') as HTMLElement | null;
      if (!layer) {
        const children = Array.from(el.children) as HTMLElement[];
        const firstContentChild = children.find(
          (c) => !c.classList.contains('parallax-bg') && !c.classList.contains('snap-content-layer')
        );
        if (firstContentChild) {
          firstContentChild.classList.add('snap-content-layer');
          layer = firstContentChild;
        }
      }
      if (layer) {
        contentLayerMap.set(id, layer);
        // 初始化默认值
        layer.style.setProperty('--section-opacity', '1');
        layer.style.setProperty('--section-translate-y', '0px');
        layer.style.setProperty('--section-scale', '1');
      }
    }

    if (sectionEls.length === 0) return;

    const setLayerVars = (el: HTMLElement, ratio: number) => {
      const layer = contentLayerMap.get(el.id);
      if (!layer) return;
      const opacity = 0.85 + ratio * 0.15;
      const translateY = (1 - ratio) * 15;
      const scale = 0.96 + ratio * 0.04;
      layer.style.setProperty('--section-opacity', opacity.toFixed(3));
      layer.style.setProperty('--section-translate-y', `${translateY.toFixed(1)}px`);
      layer.style.setProperty('--section-scale', scale.toFixed(3));
    };

    const contentObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setLayerVars(entry.target as HTMLElement, entry.intersectionRatio);
        }

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          let best = visible[0];
          for (const v of visible) {
            if (v.intersectionRatio > best.intersectionRatio) {
              best = v;
            }
          }
          const nextId = best.target.id;
          if (activeSectionRef.current !== nextId) {
            activeSectionRef.current = nextId;
            setActiveSection(nextId);
            document.body.setAttribute('data-active-section', nextId);
          }
        }
      },
      {
        // 精简阈值，降低触发频率
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '-80px 0px -30% 0px',
      }
    );

    const firstId = sectionEls[0].id;
    activeSectionRef.current = firstId;
    document.body.setAttribute('data-active-section', firstId);

    // 将初始 setState 延迟到下一帧，避免在 effect 中同步调用 setState
    // 触发级联渲染（react-hooks/set-state-in-effect）
    const rafId = requestAnimationFrame(() => {
      setActiveSection(firstId);
    });

    for (const el of sectionEls) {
      contentObserver.observe(el);
    }

    return () => {
      cancelAnimationFrame(rafId);
      contentObserver.disconnect();
    };
  }, [sectionIds, enableContentTransition]);

  // ========================================================
  // 2. Scroll 事件 — 驱动视差背景层
  // ========================================================
  useEffect(() => {
    if (parallaxStrength <= 0) return;

    let rafId: number;
    let lastUpdate = 0;
    const throttleMs = 32; // 约 30fps，足够平滑且降低 CPU 占用

    // 预先缓存 parallax 元素及其所属 section 的 offsetTop
    const parallaxItems: { el: HTMLElement; sectionTop: number }[] = [];
    const parallaxEls = document.querySelectorAll<HTMLElement>('.parallax-bg');
    for (const el of parallaxEls) {
      const section = el.closest('section, div[id]') as HTMLElement | null;
      if (section) {
        parallaxItems.push({ el, sectionTop: section.offsetTop });
      }
    }

    const updateParallax = () => {
      const now = performance.now();
      if (now - lastUpdate < throttleMs) return;
      lastUpdate = now;

      const scrollY = window.scrollY;
      for (const { el, sectionTop } of parallaxItems) {
        const relativeScroll = scrollY - sectionTop;
        const parallaxY = -relativeScroll * parallaxStrength;
        el.style.setProperty('--parallax-y', `${parallaxY.toFixed(1)}px`);
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateParallax);
    };

    updateParallax();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [parallaxStrength]);

  // ========================================================
  // 3. scrollToSection — 手动跳转
  // ========================================================
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return {
    activeSection,
    scrollToSection,
  };
}
