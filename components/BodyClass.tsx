'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 根据当前路由精确设置 body.is-home，避免首页 scroll-snap 状态
 * 在客户端导航时残留到其他页面，导致详情页被滚动到底部。
 */
export default function BodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    const isHome = pathname === '/';
    document.body.classList.toggle('is-home', isHome);
  }, [pathname]);

  return null;
}
