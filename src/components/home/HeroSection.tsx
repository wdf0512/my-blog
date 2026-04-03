'use client';

import { HeroSceneLoader } from '@/components/3d/HeroSceneLoader';
import { Github, Twitter, Linkedin, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import btn from '@/styles/buttons.module.css';
import styles from './HeroSection.module.css';

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/yourusername', icon: Github, color: 'var(--text-primary)' },
  { label: 'Twitter', href: 'https://twitter.com/yourusername', icon: Twitter, color: '#1DA1F2' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/yourusername', icon: Linkedin, color: '#0A66C2' },
  { label: 'Email', href: 'mailto:defangninj@outlook.com', icon: Mail, color: 'var(--primary)' },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Radial glow — gives glass buttons their blur target */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(ellipse 55% 60% at 20% 50%, rgba(242,201,76,0.07) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative container mx-auto px-4 py-14 md:py-24 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: text + CTA ── */}
          <div className="order-2 lg:order-1 flex flex-col items-start gap-5">

            {/* Eyebrow label */}
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden />
              Developer · Writer · Builder
            </div>

            {/* Heading */}
            <h1 className="font-display font-black leading-[1.05] tracking-tight text-text-primary mb-5"
              style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}>
              Hi, I&apos;m{' '}
              <span className="text-primary">Defang.</span>
            </h1>

            {/* Tagline — one concise line, not two paragraphs */}
            <p className="text-text-secondary leading-relaxed mb-8"
              style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)', maxWidth: '38ch' }}>
              I build beautiful web experiences and share everything I learn — from React patterns to indie hacking and creative coding with Three.js.
            </p>

            {/* CTA — right after the hook, not buried */}
            <div className="mb-8">
              <Link href="/blog" className={btn.btnPrimary}>
                <span className={btn.btnLabel}>Read my articles</span>
                <span className={btn.btnKnob} aria-hidden>
                  <ChevronRight className={btn.btnKnobIcon} strokeWidth={2.25} />
                </span>
              </Link>
            </div>

          </div>

          {/* ── Right: 3D character + social icons ── */}
          <div className="order-1 lg:order-2 flex flex-col items-center gap-8">
            <HeroSceneLoader />

            {/* Neumorphic social icons */}
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
