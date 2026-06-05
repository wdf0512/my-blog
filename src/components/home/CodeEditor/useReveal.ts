'use client';

import { useEffect, useRef, useState } from 'react';

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(prefersReduced);

    if (!node) return;

    if (prefersReduced) {
      setInView(true);
      return;
    }

    // Already on screen at mount (e.g. fast scroll / short pages).
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0, rootMargin: '0px 0px -120px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView, reduced };
}
