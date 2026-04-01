'use client';

import dynamic from 'next/dynamic';

const HeroTypewriter = dynamic(
  () => import('./HeroTypewriter').then((m) => m.HeroTypewriter),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: '100vh', background: '#000' }} />,
  }
);

export function HeroTypewriterLoader() {
  return <HeroTypewriter />;
}
