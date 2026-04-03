'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useFlipCards(gridRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!gridRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>('[data-post-slug]', gridRef.current);
      if (cards.length === 0) return;

      gsap.from(cards, {
        rotateY: -45,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.4)',
        stagger: { each: 0.08, from: 'start' },
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    },
    { scope: gridRef }
  );
}
