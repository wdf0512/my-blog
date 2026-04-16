'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/** Parse "5+" → { value: 5, suffix: "+" }, "1K+" → { value: 1000, suffix: "K+" }, "∞" → null */
function parse(raw: string): { value: number; suffix: string } | null {
  if (raw === '∞') return null;
  const match = raw.match(/^(\d+(?:\.\d+)?)(K?)(\+?)(.*)$/);
  if (!match) return null;
  const num = parseFloat(match[1]) * (match[2] === 'K' ? 1000 : 1);
  const suffix = match[2] + match[3] + match[4];
  return { value: num, suffix };
}

function format(n: number, suffix: string): string {
  if (suffix.startsWith('K')) return Math.round(n / 1000) + suffix;
  return Math.round(n) + suffix;
}

export function useCountUp(ref: RefObject<HTMLElement | null>, target: string) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const parsed = parse(target);
    if (!parsed) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: parsed.value,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate() {
        if (el) el.textContent = format(obj.val, parsed.suffix);
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  }, [target]);
}
