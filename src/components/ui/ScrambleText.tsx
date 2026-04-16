'use client';

import { useRef } from 'react';
import { useTextScramble } from '@/hooks/useTextScramble';

export function ScrambleText({
  children,
  trigger = true,
  duration = 600,
  className,
  style,
}: {
  children: string;
  trigger?: boolean;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useTextScramble(ref, { trigger, duration });
  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', ...style }}>
      {children}
    </span>
  );
}
