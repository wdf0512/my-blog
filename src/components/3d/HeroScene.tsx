'use client';

import { Character } from './Character';

function HeroScene() {
  return (
    <div className="w-full h-[320px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
      <Character />
    </div>
  );
}

export default HeroScene;
