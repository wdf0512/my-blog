'use client';

import dynamic from 'next/dynamic';

const CursorTrail = dynamic(
  () => import('./CursorTrail').then((m) => m.CursorTrail),
  { ssr: false }
);

export function CursorTrailMount() {
  return <CursorTrail />;
}
