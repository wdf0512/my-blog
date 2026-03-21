'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the 3D scene (code-split)
const HeroScene = dynamic(() => import('./HeroScene').then((mod) => ({ default: mod.HeroScene })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary">Loading 3D scene...</p>
      </div>
    </div>
  ),
});

export function HeroSceneLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Progressive enhancement: only load on capable devices
    const isCapable =
      typeof window !== 'undefined' &&
      window.innerWidth > 768 && // Desktop/tablet only
      !navigator.userAgent.match(/mobile/i) && // Not on mobile
      'WebGLRenderingContext' in window; // WebGL support

    if (isCapable) {
      // Delay load to prioritize critical content
      const timer = setTimeout(() => setShouldLoad(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldLoad) {
    return (
      <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center bg-surface rounded-lg border border-border">
        <div className="text-center">
          <div className="text-6xl mb-4">👨‍💻</div>
          <p className="text-text-secondary">Interactive 3D scene loading...</p>
        </div>
      </div>
    );
  }

  return <HeroScene />;
}
