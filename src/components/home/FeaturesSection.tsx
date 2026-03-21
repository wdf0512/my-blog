'use client';

import { motion } from 'framer-motion';
import { Code2, Rocket, Sparkles } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren, item } from '@/components/animations/StaggerChildren';
import { ScaleOnHover } from '@/components/animations/ScaleOnHover';

export function FeaturesSection() {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <FadeIn className="text-center mb-16">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          What You'll Find Here
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          A blend of cutting-edge technology and creative storytelling
        </p>
      </FadeIn>

      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          variants={item}
          className="glass-card p-8 rounded-xl hover:shadow-xl transition-shadow"
        >
          <ScaleOnHover>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-4">
              Web Development
            </h3>
            <p className="text-text-secondary">
              Deep dives into React, Next.js, and modern web technologies with
              practical examples and best practices.
            </p>
          </ScaleOnHover>
        </motion.div>

        <motion.div
          variants={item}
          className="glass-card p-8 rounded-xl hover:shadow-xl transition-shadow"
        >
          <ScaleOnHover>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-4">
              AI & Innovation
            </h3>
            <p className="text-text-secondary">
              Exploring artificial intelligence, machine learning, and
              cutting-edge tech that shapes our future.
            </p>
          </ScaleOnHover>
        </motion.div>

        <motion.div
          variants={item}
          className="glass-card p-8 rounded-xl hover:shadow-xl transition-shadow"
        >
          <ScaleOnHover>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-4">
              3D & Animations
            </h3>
            <p className="text-text-secondary">
              Creating immersive experiences with React Three Fiber, GSAP, and
              interactive 3D graphics.
            </p>
          </ScaleOnHover>
        </motion.div>
      </StaggerChildren>
    </section>
  );
}
