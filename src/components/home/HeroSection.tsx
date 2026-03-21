'use client';

import { HeroSceneLoader } from '@/components/3d/HeroSceneLoader';
import { FadeIn } from '@/components/animations/FadeIn';
import { ScaleOnHover } from '@/components/animations/ScaleOnHover';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <FadeIn direction="right" className="text-center lg:text-left">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-text-primary via-primary to-text-primary bg-clip-text text-transparent">
            Welcome to the Future of Web Development
          </h1>
          <p className="text-text-secondary text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
            Exploring React, AI, and modern web development with stunning 3D
            visual effects and interactive experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <ScaleOnHover>
              <Link
                href="/blog"
                className="px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:shadow-lg transition-shadow"
              >
                Read the Blog
              </Link>
            </ScaleOnHover>
            <ScaleOnHover>
              <a
                href="#features"
                className="px-8 py-4 border-2 border-border rounded-lg hover:border-primary transition-colors"
              >
                Explore Features
              </a>
            </ScaleOnHover>
          </div>
        </FadeIn>

        {/* 3D Character */}
        <FadeIn delay={0.2} direction="left">
          <HeroSceneLoader />
        </FadeIn>
      </div>
    </section>
  );
}
