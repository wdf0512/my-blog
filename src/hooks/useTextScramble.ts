'use client';

import { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_./λ>-';

export function useTextScramble(
  ref: RefObject<HTMLElement | null>,
  options: { trigger?: boolean; duration?: number } = {}
) {
  const { trigger = false, duration = 600 } = options;

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const original = el.textContent ?? '';
    const totalFrames = Math.max(1, Math.round(duration / 40));
    let rafId = 0;

    const run = () => {
      cancelAnimationFrame(rafId);
      let frame = 0;

      const tick = () => {
        let out = '';
        const resolved = (frame / totalFrames) * original.length;
        for (let i = 0; i < original.length; i++) {
          if (i < resolved) {
            out += original[i];
          } else if (original[i] === ' ') {
            out += ' ';
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        el.textContent = out;
        frame++;
        if (frame <= totalFrames) {
          rafId = requestAnimationFrame(tick);
        } else {
          el.textContent = original;
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (trigger) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: run,
        });
      } else {
        const timeout = window.setTimeout(run, 100);
        return () => clearTimeout(timeout);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      mm.revert();
    };
  }, [trigger, duration]);
}
