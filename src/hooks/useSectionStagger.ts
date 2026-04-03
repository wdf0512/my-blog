'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function useSectionStagger(
  sectionRef: RefObject<HTMLElement | null>,
  options: { springCards?: boolean } = {}
) {
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const svgLine = sectionRef.current.querySelector<SVGLineElement>('.section-divider line');
      const children = gsap.utils.toArray<HTMLElement>('[data-stagger]', sectionRef.current);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      // Animate SVG divider line drawing in
      if (svgLine) {
        gsap.set(svgLine, { strokeDasharray: 2000, strokeDashoffset: 2000 });
        tl.to(svgLine, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' });
      }

      if (children.length > 0) {
        tl.from(
          children,
          {
            y: 32,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: options.springCards ? 'back.out(1.7)' : 'power2.out',
          },
          svgLine ? '-=0.4' : 0
        );
      }
    },
    { scope: sectionRef }
  );
}
