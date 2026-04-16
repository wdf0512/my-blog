'use client';

import { useRef, RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function useMagneticButton<T extends HTMLElement>(
  strength = 0.35
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(
      '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
      () => {
        const onMouseMove = (e: MouseEvent) => {
          const { left, top, width, height } = el.getBoundingClientRect();
          const cx = left + width / 2;
          const cy = top + height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          gsap.to(el, {
            x: dx * strength,
            y: dy * strength,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        const onMouseLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
            overwrite: 'auto',
          });
        };

        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseLeave);

        return () => {
          el.removeEventListener('mousemove', onMouseMove);
          el.removeEventListener('mouseleave', onMouseLeave);
        };
      }
    );

    return () => mm.revert();
  }, [strength]);

  return ref;
}
