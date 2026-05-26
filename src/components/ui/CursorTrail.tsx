'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * 轻量光环跟随。
 *
 * 与旧版差异:
 * - 不再设置 `cursor: none`,保留原生光标(阅读类网站这是反模式)。
 * - mousemove 用 rAF 节流(原版每个 mousemove 事件都调用 4 个 quickTo)。
 * - 触屏 / 粗指针 / reduced-motion 用户直接不挂载。
 */
export function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mm = gsap.matchMedia();
    mm.add(
      '(min-width: 769px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        gsap.set(dot, { xPercent: -50, yPercent: -50 });
        gsap.set(ring, { xPercent: -50, yPercent: -50 });

        const moveX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'none' });
        const moveY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'none' });
        const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
        const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

        let revealed = false;
        let pendingX = 0;
        let pendingY = 0;
        let rafScheduled = false;

        const flush = () => {
          rafScheduled = false;
          moveX(pendingX);
          moveY(pendingY);
          ringX(pendingX);
          ringY(pendingY);
        };

        const onMouseMove = (e: MouseEvent) => {
          if (!revealed) {
            gsap.set([dot, ring], { opacity: 1 });
            revealed = true;
          }
          pendingX = e.clientX;
          pendingY = e.clientY;
          if (!rafScheduled) {
            rafScheduled = true;
            requestAnimationFrame(flush);
          }
        };

        const onEnterInteractive = (e: MouseEvent) => {
          if ((e.target as Element).closest('a, button')) {
            gsap.to(dot, { scale: 0, duration: 0.2, overwrite: 'auto' });
            gsap.to(ring, { scale: 1.8, opacity: 0.4, duration: 0.3, overwrite: 'auto' });
          }
        };

        const onLeaveInteractive = (e: MouseEvent) => {
          if ((e.target as Element).closest('a, button')) {
            gsap.to(dot, { scale: 1, duration: 0.2, overwrite: 'auto' });
            gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, overwrite: 'auto' });
          }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseover', onEnterInteractive, { passive: true });
        document.addEventListener('mouseout', onLeaveInteractive, { passive: true });

        return () => {
          window.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseover', onEnterInteractive);
          document.removeEventListener('mouseout', onLeaveInteractive);
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--primary)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '2px solid var(--primary)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0,
          willChange: 'transform',
        }}
      />
    </>
  );
}
