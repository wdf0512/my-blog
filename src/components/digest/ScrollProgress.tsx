'use client';

import { useEffect, useState } from 'react';

/** Top-pinned 2px scroll progress rail.
 *  Tries CSS scroll-driven animation first (Chrome 115+); falls back to a
 *  small scroll listener for Safari/Firefox. Respects prefers-reduced-motion. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [supportsCss, setSupportsCss] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const supported = CSS.supports('animation-timeline', 'scroll(root)');
    setSupportsCss(supported);

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);
    const onMql = () => setReduceMotion(mql.matches);
    mql.addEventListener('change', onMql);

    if (supported) {
      return () => mql.removeEventListener('change', onMql);
    }

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? doc.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      mql.removeEventListener('change', onMql);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary/10 z-50 pointer-events-none"
    >
      <div
        className={
          supportsCss && !reduceMotion
            ? 'digest-scroll-progress h-full bg-primary origin-left'
            : 'h-full bg-primary origin-left'
        }
        style={
          supportsCss && !reduceMotion
            ? undefined
            : { transform: `scaleX(${reduceMotion ? 1 : progress})` }
        }
      />
    </div>
  );
}
