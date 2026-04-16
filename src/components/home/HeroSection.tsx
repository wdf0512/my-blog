'use client';

import { HeroSceneLoader } from '@/components/3d/HeroSceneLoader';
import { Github, Twitter, Linkedin, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import btn from '@/styles/buttons.module.css';
import styles from './HeroSection.module.css';
import { useParallaxHero } from '@/hooks/useParallaxHero';

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/wdf0512', icon: Github, color: 'var(--text-primary)' },
  { label: 'Twitter', href: 'https://x.com/De991025', icon: Twitter, color: '#1DA1F2' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/defang-weng-169591226/', icon: Linkedin, color: '#0A66C2' },
  { label: 'Email', href: 'mailto:defangninj@outlook.com', icon: Mail, color: 'var(--primary)' },
] as const;

export function HeroSection() {
  const { sectionRef, textRef, asciiRef } = useParallaxHero();

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(ellipse 55% 60% at 20% 50%, rgba(242,201,76,0.07) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: text + CTA */}
          <div ref={textRef} className="order-2 lg:order-1 flex flex-col items-start gap-5">
            <div data-hero-item className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden />
              AI Engineer · Full-Stack Dev · Builder
            </div>

            <h1
              data-hero-item
              className="font-display font-black leading-[1.05] tracking-tight text-text-primary mb-5"
              style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
            >
              Hi, I&apos;m{' '}
              <span className="text-primary">Defang.</span>
            </h1>

            <p
              data-hero-item
              className="text-text-secondary leading-relaxed mb-8"
              style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)', maxWidth: '38ch' }}
            >
              Full-stack AI engineer. I love programming, obsess over intelligent systems, and write about everything AI — what&apos;s shipping, what&apos;s breaking, and what actually matters.
            </p>

            <div data-hero-item className="mb-8">
              <Link href="/blog" className={btn.btnPrimary}>
                <span className={btn.btnLabel}>Read my articles</span>
                <span className={btn.btnKnob} aria-hidden>
                  <ChevronRight className={btn.btnKnobIcon} strokeWidth={2.25} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right: 3D character + social icons */}
          <div ref={asciiRef} className="order-1 lg:order-2 flex flex-col items-center gap-8">
            <HeroSceneLoader />

            <div className="flex items-center gap-4">
              {SOCIAL.map(({ label, href, icon: Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className={styles.neuBtn}
                >
                  <Icon size={22} style={{ color }} aria-hidden />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
