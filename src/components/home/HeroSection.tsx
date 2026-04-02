'use client';

import { HeroSceneLoader } from '@/components/3d/HeroSceneLoader';
import { Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Personal intro */}
        <div className="order-2 lg:order-1">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-text-primary">
            Hi, I'm <span className="text-primary">Defang</span>
          </h1>

          <p className="text-text-secondary text-xl md:text-2xl leading-relaxed mb-6">
            A full-stack developer passionate about building beautiful web experiences,
            indie hacking, and sharing what I learn along the way.
          </p>

          <p className="text-text-secondary text-lg leading-relaxed mb-8">
            I write about React, Next.js, TypeScript, and the journey of building products
            as an indie developer. Currently working on AI-powered tools and exploring
            creative coding with Three.js.
          </p>

          {/* Social links */}
          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-primary transition-all group shadow-sm"
            >
              <Github className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" />
              <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                GitHub
              </span>
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-primary transition-all group shadow-sm"
            >
              <Twitter className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" />
              <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                Twitter
              </span>
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-primary transition-all group shadow-sm"
            >
              <Linkedin className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" />
              <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                LinkedIn
              </span>
            </a>
            <a
              href="mailto:defangninj@outlook.com"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-primary transition-all group shadow-sm"
            >
              <Mail className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" />
              <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                Email
              </span>
            </a>
          </div>

          {/* CTA */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-yellow-500 text-text-primary hover:text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all group"
          >
            Read my articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right: 3D Character */}
        <div className="order-1 lg:order-2 flex justify-center">
          <HeroSceneLoader />
        </div>
      </div>
    </section>
  );
}
