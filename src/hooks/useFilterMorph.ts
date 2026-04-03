'use client';

import { RefObject, useEffect } from 'react';
import gsap from 'gsap';

export function useFilterMorph(
  gridRef: RefObject<HTMLElement | null>,
  activeTag: string | null
) {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = gsap.utils.toArray<HTMLElement>('[data-post-slug]', grid);
    if (cards.length === 0) return;

    gsap.killTweensOf(cards);

    if (activeTag === null) {
      gsap.to(cards, { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
      return;
    }

    cards.forEach((card) => {
      const tags = (card.dataset.postTags ?? '').split(',').filter(Boolean);
      const matches = tags.includes(activeTag);

      if (matches) {
        const tl = gsap.timeline();
        tl.to(card, { opacity: 1, scale: 1.02, duration: 0.2, ease: 'power2.out' })
          .to(card, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
      } else {
        gsap.to(card, { scale: 0.92, opacity: 0.25, duration: 0.25, ease: 'power2.out' });
      }
    });
  }, [activeTag]); // gridRef is a stable ref object, not a reactive dependency
}
