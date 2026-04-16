'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px) and (pointer: fine)', () => {
      document.documentElement.setAttribute('data-custom-cursor', '');

      gsap.set(dot, { xPercent: -50, yPercent: -50 });
      gsap.set(ring, { xPercent: -50, yPercent: -50 });

      const moveX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'none' });
      const moveY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'none' });
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

      let revealed = false;
      const onMouseMove = (e: MouseEvent) => {
        if (!revealed) {
          gsap.set([dot, ring], { opacity: 1 });
          revealed = true;
        }
        moveX(e.clientX);
        moveY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
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

      window.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseover', onEnterInteractive);
      document.addEventListener('mouseout', onLeaveInteractive);

      return () => {
        document.documentElement.removeAttribute('data-custom-cursor');
        window.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseover', onEnterInteractive);
        document.removeEventListener('mouseout', onLeaveInteractive);
      };
    });

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
