'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ASCII banana scene (code-split)
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Loading ASCII art...</p>
      </div>
    </div>
  ),
});

export function HeroSceneLoader() {
  return <HeroScene />;
}
