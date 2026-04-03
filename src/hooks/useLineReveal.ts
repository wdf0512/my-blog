'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function useLineReveal(containerRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const lines = gsap.utils.toArray<HTMLElement>('.line-inner', containerRef.current);
      if (lines.length === 0) return;

      gsap.from(lines, {
        y: '100%',
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    },
    { scope: containerRef }
  );
}
