'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function useParallaxHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const asciiRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(textRef.current, { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' })
        .from(asciiRef.current, { x: 60, opacity: 0, duration: 1.2, ease: 'power3.out' }, '<0.1');

      const q = gsap.utils.selector(textRef);
      tl.from(
        q('[data-hero-item]'),
        { y: 20, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out' },
        '<0.2'
      );

      // 鼠标视差 — 仅桌面 + 用 rAF 节流 + quickTo,避免每帧创建新 tween
      const mm = gsap.matchMedia();
      mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
        const section = sectionRef.current;
        if (!section) return;

        const textX = gsap.quickTo(textRef.current, 'x', { duration: 0.5, ease: 'power1.out' });
        const textY = gsap.quickTo(textRef.current, 'y', { duration: 0.5, ease: 'power1.out' });
        const asciiX = gsap.quickTo(asciiRef.current, 'x', { duration: 0.7, ease: 'power1.out' });
        const asciiY = gsap.quickTo(asciiRef.current, 'y', { duration: 0.7, ease: 'power1.out' });

        let pendingX = 0;
        let pendingY = 0;
        let scheduled = false;

        // Cache rect once; refresh only on resize/scroll so the mousemove hot path
        // doesn't trigger a synchronous layout read on every event.
        let rect = section.getBoundingClientRect();
        const refreshRect = () => {
          rect = section.getBoundingClientRect();
        };

        const flush = () => {
          scheduled = false;
          textX(pendingX * 8);
          textY(pendingY * 8);
          asciiX(-pendingX * 18);
          asciiY(-pendingY * 18);
        };

        const onMouseMove = (e: MouseEvent) => {
          pendingX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
          pendingY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
          if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(flush);
          }
        };

        section.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('resize', refreshRect, { passive: true });
        window.addEventListener('scroll', refreshRect, { passive: true });
        return () => {
          section.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('resize', refreshRect);
          window.removeEventListener('scroll', refreshRect);
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return { sectionRef, textRef, asciiRef };
}
