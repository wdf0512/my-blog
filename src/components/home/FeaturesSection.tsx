'use client';

import { motion } from 'framer-motion';
import { Code2, Rocket, Sparkles } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren, item } from '@/components/animations/StaggerChildren';
import { ScaleOnHover } from '@/components/animations/ScaleOnHover';

const features = [
  {
    icon: Code2,
    title: 'Web Development',
    description:
      'Deep dives into React, Next.js, and modern web technologies with practical examples and best practices.',
    gradient: 'from-primary to-primary-light',
  },
  {
    icon: Sparkles,
    title: 'AI & Innovation',
    description:
      'Exploring artificial intelligence, machine learning, and cutting-edge tech that shapes our future.',
    gradient: 'from-accent to-accent-light',
  },
  {
    icon: Rocket,
    title: '3D & Animations',
    description:
      'Creating immersive experiences with React Three Fiber, GSAP, and interactive 3D graphics.',
    gradient: 'from-primary-light to-accent',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,107,53,0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 relative">
        <FadeIn className="text-center mb-20">
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-text-primary via-primary to-accent bg-clip-text text-transparent">
            What You'll Discover
          </h2>
          <p className="text-text-secondary text-xl md:text-2xl max-w-3xl mx-auto font-light">
            A blend of cutting-edge technology, creative storytelling, and hands-on tutorials
          </p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={item}
                className="group relative"
              >
                <ScaleOnHover>
                  <div className="glass-card p-8 md:p-10 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                    {/* Icon with gradient background */}
                    <div className="relative mb-8">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 blur-2xl rounded-full`}
                      />
                      <div
                        className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                    </div>

                    <h3 className="font-display text-3xl font-bold mb-4 text-text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary text-lg leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover accent line */}
                    <div
                      className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} mt-6 transition-all duration-300 rounded-full`}
                    />
                  </div>
                </ScaleOnHover>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
