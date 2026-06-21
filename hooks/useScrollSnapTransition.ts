'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * 滚动吸附过渡增强 Hook
 *
 * 功能：
 * 1. 监听各 section 的 IntersectionObserver 可见比例，
 *    实时更新 CSS 自定义属性（--section-opacity / --section-translate-y / --section-scale），
 *    实现 section 切换时的淡入淡出 + 微位移动画。
 * 2. 监听滚动位置，更新视差层的 --parallax-y 实现背景视差效果。
 * 3. 返回当前活跃 section ID，供滚动进度指示器使用。
 */

export interface SnapSection {
  id: string;
  /** 该 section 的 DOM 元素引用 */
  element: HTMLElement;
}

export interface UseScrollSnapTransitionOptions {
  /** section ID 列表，按页面顺序排列 */
  sectionIds: string[];
  /** 视差强度：背景层相对于滚动位置的偏移系数，默认 0.15 */
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
  parallaxStrength = 0.15,
  enableContentTransition = true,
}: UseScrollSnapTransitionOptions): UseScrollSnapTransitionReturn {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');

  const updateCSSVar = useCallback((el: HTMLElement, name: string, value: string) => {
    el.style.setProperty(name, value);
  }, []);

  // 保持 contentLayers 引用稳定，避免 cleanup 导致 CSS 变量丢失
  const contentLayersRef = useRef<Map<string, HTMLElement>>(new Map());

  // ========================================================
  // 1. IntersectionObserver — 驱动内容淡入淡出 + 缩放
  // ========================================================
  useEffect(() => {
    if (sectionIds.length === 0 || !enableContentTransition) return;

    // 缓存 section 元素引用
    const sectionEls: HTMLElement[] = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) sectionEls.push(el);
    }

    if (sectionEls.length === 0) return;

    const contentLayers = contentLayersRef.current;

    const ensureContentLayer = (el: HTMLElement): HTMLElement | null => {
      const id = el.id;
      if (contentLayers.has(id)) return contentLayers.get(id)!;

      // 查找直接子元素中带有 snap-content-layer 类的元素
      let layer = el.querySelector(':scope > .snap-content-layer') as HTMLElement | null;
      if (!layer) {
        // 自动包装：如果没有显式的 snap-content-layer，
        // 查找第一个非 parallax-bg 的直接子元素
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
        contentLayers.set(id, layer);
      }
      return layer;
    };

    // 使用多个阈值实现渐变过渡
    const thresholds = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

    const contentObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const ratio = entry.intersectionRatio;
          const layer = ensureContentLayer(entry.target as HTMLElement);
          if (!layer) continue;

          // 平滑映射：ratio 0→1 映射到 opacity 0.85→1 和 translateY 15px→0
          const opacity = 0.85 + ratio * 0.15;  // 范围 0.85 ~ 1.0
          const translateY = (1 - ratio) * 15;  // 范围 0 ~ 15px
          const scale = 0.96 + ratio * 0.04;    // 范围 0.96 ~ 1.0

          updateCSSVar(layer, '--section-opacity', opacity.toFixed(3));
          updateCSSVar(layer, '--section-translate-y', `${translateY.toFixed(1)}px`);
          updateCSSVar(layer, '--section-scale', scale.toFixed(3));
        }

        // 更新 activeSection
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
          setActiveSection(best.target.id);
          document.body.setAttribute('data-active-section', best.target.id);
        }
      },
      {
        threshold: thresholds,
        // rootMargin: 顶部扣除导航栏，底部缩小检测区
        rootMargin: '-80px 0px -30% 0px',
      }
    );

    // 初始化：先确保所有 section 的 contentLayer 存在，然后设置初始 CSS 变量
    for (const el of sectionEls) {
      ensureContentLayer(el);
    }

    // 为所有 section 设置初始值（全可见态），然后 observer 会在触发时调整
    for (const el of sectionEls) {
      const layer = contentLayers.get(el.id);
      if (layer) {
        updateCSSVar(layer, '--section-opacity', '1');
        updateCSSVar(layer, '--section-translate-y', '0px');
        updateCSSVar(layer, '--section-scale', '1');
      }
    }

    // 设置初始 data-active-section（状态默认值已在 useState 中设置）
    document.body.setAttribute('data-active-section', sectionEls[0].id);

    // 开始观察所有 section
    for (const el of sectionEls) {
      contentObserver.observe(el);
    }

    return () => {
      contentObserver.disconnect();
      // 注意：不重置 CSS 变量，保持 contentLayersRef 中的引用
      // 这样即使 effect 重新执行，已有的层仍然保留 CSS 变量
    };
  }, [sectionIds, enableContentTransition, updateCSSVar]);

  // ========================================================
  // 2. Scroll 事件 — 驱动视差背景层
  // ========================================================
  useEffect(() => {
    if (parallaxStrength <= 0) return;

    let rafId: number;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      const parallaxEls = document.querySelectorAll<HTMLElement>('.parallax-bg');
      for (const el of parallaxEls) {
        const section = el.closest('section, div[id]') as HTMLElement | null;
        if (!section) continue;

        const sectionTop = section.offsetTop;
        // 视差偏移：背景层反向移动
        const relativeScroll = scrollY - sectionTop;
        const parallaxY = -relativeScroll * parallaxStrength;
        updateCSSVar(el, '--parallax-y', `${parallaxY.toFixed(1)}px`);
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateParallax);
    };

    // 初始更新
    updateParallax();

    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [parallaxStrength, updateCSSVar]);

  // ========================================================
  // 3. scrollToSection — 手动跳转（保留 scroll-snap 行为）
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
