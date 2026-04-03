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

      // Text column enters from left, ASCII from right at different speeds
      tl.from(textRef.current, { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' })
        .from(asciiRef.current, { x: 60, opacity: 0, duration: 1.2, ease: 'power3.out' }, '<0.1');

      // Stagger internal items inside text column
      const q = gsap.utils.selector(textRef);
      tl.from(
        q('[data-hero-item]'),
        { y: 20, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out' },
        '<0.2'
      );

      // Mouse parallax — desktop only
      const mm = gsap.matchMedia();
      mm.add('(min-width: 769px)', () => {
        const section = sectionRef.current;
        if (!section) return;

        const onMouseMove = (e: MouseEvent) => {
          const { left, top, width, height } = section.getBoundingClientRect();
          const x = (e.clientX - left - width / 2) / (width / 2);
          const y = (e.clientY - top - height / 2) / (height / 2);
          gsap.to(textRef.current, { x: x * 8, y: y * 8, duration: 0.5, ease: 'power1.out' });
          gsap.to(asciiRef.current, { x: -x * 18, y: -y * 18, duration: 0.7, ease: 'power1.out' });
        };

        section.addEventListener('mousemove', onMouseMove);
        return () => section.removeEventListener('mousemove', onMouseMove);
      });
    },
    { scope: sectionRef }
  );

  return { sectionRef, textRef, asciiRef };
}
