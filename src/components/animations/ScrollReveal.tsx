'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ScrollReveal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    // start: element bottom touches viewport bottom
    // end: element top touches viewport top
    offset: ['start end', 'end start'],
  });

  // Smooth the raw scroll value to avoid jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  // Fade in during [0 → 0.15], hold [0.15 → 0.8], fade out [0.8 → 1]
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);

  // Slide up on entry [0 → 0.15], hold, drift up slightly on exit [0.8 → 1]
  const y = useTransform(smoothProgress, [0, 0.15, 0.8, 1], [56, 0, 0, -24]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}
