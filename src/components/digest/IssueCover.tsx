'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  src: string;
  alt: string;
};

/** Cover image w/ paper-grain overlay + subtle scroll parallax (capped ≤28px).
 *  Disabled under prefers-reduced-motion. */
export function IssueCover({ src, alt }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-12, 28]);

  return (
    <div
      ref={ref}
      className="paper-grain relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-surface"
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="absolute inset-0 w-full h-[112%] -top-[6%] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent z-[2]" />
    </div>
  );
}
