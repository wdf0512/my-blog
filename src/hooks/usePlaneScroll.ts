'use client';

import { useRef, RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function usePlaneScroll(sectionRef: RefObject<HTMLElement | null>) {
  const planeRef = useRef<SVGGElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const plane = planeRef.current;
      if (!section || !plane) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(plane, {
          motionPath: {
            path: '#plane-path',
            align: '#plane-path',
            autoRotate: true,
            alignOrigin: [0.5, 0.5],
            start: 0,
            end: 1,
          },
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return { planeRef };
}
