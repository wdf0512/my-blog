'use client';

import { useRef } from 'react';
import { Github, Mail, Twitter } from 'lucide-react';
import btn from '@/styles/buttons.module.css';
import now from './AboutSections.module.css';
import { useSectionStagger } from '@/hooks/useSectionStagger';
import { useLineReveal } from '@/hooks/useLineReveal';

const FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--primary)',
  textTransform: 'uppercase',
};

const NOW_ITEMS = [
  {
    glyph: '>_',
    label: 'Building',
    desc: 'An Agentic ERP system with multi-agent LLM orchestration (LangGraph) and Generative UI via SSE streaming.',
  },
  {
    glyph: 'λ',
    label: 'Learning',
    desc: 'Cutting-edge AI research — foundation models, reasoning systems, and agent architectures — while sharpening technical English to communicate ideas with precision.',
  },
  {
    glyph: '//',
    label: 'Writing',
    desc: 'Documenting what I build and what the field is shipping — agentic patterns, model releases, tooling shifts, and the hard lessons that don\'t make it into the papers.',
  },
];

export function AboutSections() {
  const storyRef = useRef<HTMLElement>(null);
  const nowRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useSectionStagger(storyRef);
  useSectionStagger(nowRef, { springCards: true });
  useSectionStagger(contactRef);
  useLineReveal(quoteRef);

  return (
    <>
      {/* Section: My Story */}
      <section
        ref={storyRef}
        className="px-4 md:px-8 py-12 md:py-20"
        style={{ background: 'var(--surface)' }}
      >
        <svg className="section-divider w-full mb-12" height="2" aria-hidden>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="1" />
        </svg>

        <div className="max-w-[960px] mx-auto">
          <p data-stagger className="mb-8" style={SECTION_LABEL}>My Story</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* quote-block intentionally has no data-stagger — handled by useLineReveal in Task 7 */}
            <div ref={quoteRef} className="quote-block">
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 'clamp(20px, 2.5vw, 26px)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.35,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                <span className="line-outer" style={{ overflow: 'hidden', display: 'block' }}>
                  <span className="line-inner" style={{ display: 'block' }}>
                    &ldquo;Building with AI is the most
                  </span>
                </span>
                <span className="line-outer" style={{ overflow: 'hidden', display: 'block' }}>
                  <span className="line-inner" style={{ display: 'block' }}>
                    exciting thing I&apos;ve done.&rdquo;
                  </span>
                </span>
              </p>
            </div>
            <div
              data-stagger
              className="flex flex-col gap-4"
              style={{ fontFamily: FONT, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}
            >
              <p style={{ margin: 0 }}>
                I started as a frontend developer and gradually moved into full-stack and
                AI engineering. Working across China and Australia sharpened my ability to
                deliver production systems under real business pressure.
              </p>
              <p style={{ margin: 0 }}>
                Today I work on multi-agent LLM systems — designing the orchestration
                layer, building the API, and wiring up the React UI. I love owning the
                whole stack end-to-end.
              </p>
              <p style={{ margin: 0 }}>
                I believe in learning in public and sharing what I&apos;ve built, broken,
                and fixed along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: What I'm Doing Now */}
      <section
        ref={nowRef}
        className="px-4 md:px-8 py-12 md:py-20"
        style={{ background: 'var(--surface)' }}
      >
        <svg className="section-divider w-full mb-12" height="2" aria-hidden>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="1" />
        </svg>

        <div className="max-w-[960px] mx-auto">
          <p data-stagger className={now.nowLabel}>
            <span className={now.pulseDot} aria-hidden="true" />
            What I&apos;m Doing Now
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {NOW_ITEMS.map((item) => (
              <div
                key={item.label}
                data-stagger
                className={now.nowCard}
              >
                <div className={now.badge}>{item.glyph}</div>
                <div className={now.cardLabel}>{item.label}</div>
                <div className={now.cardDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Contact */}
      <section
        ref={contactRef}
        className="px-4 md:px-8 py-12 md:py-20 text-center"
        style={{ background: 'var(--background)' }}
      >
        <svg className="section-divider w-full mb-12" height="2" aria-hidden>
          <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border)" strokeWidth="1" />
        </svg>

        <div className="max-w-[960px] mx-auto">
          <p data-stagger className="mb-4" style={SECTION_LABEL}>Let&apos;s Talk</p>
          <p
            data-stagger
            className="mb-3"
            style={{
              fontFamily: FONT,
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            Want to work together?
          </p>
          <p
            data-stagger
            className="mb-8"
            style={{ fontFamily: FONT, fontSize: '15px', color: 'var(--text-secondary)' }}
          >
            I&apos;m always open to interesting projects, collabs, or just a chat.
          </p>
          <div data-stagger className="flex flex-wrap justify-center gap-3">
            <a href="mailto:defangninj@outlook.com" className={btn.btnPrimary}>
              <span className={btn.btnLabel}>defangninj@outlook.com</span>
              <span className={btn.btnKnob} aria-hidden>
                <Mail className={btn.btnKnobIcon} strokeWidth={2} />
              </span>
            </a>
            <a href="https://github.com/wdf0512" target="_blank" rel="noopener noreferrer" className={btn.btnSecondary}>
              <Github className={btn.btnSecondaryIcon} size={16} aria-hidden />
              <span className={btn.btnLabel}>GitHub</span>
            </a>
            <a href="https://x.com/De991025" target="_blank" rel="noopener noreferrer" className={btn.btnSecondary}>
              <Twitter className={btn.btnSecondaryIcon} size={16} aria-hidden />
              <span className={btn.btnLabel}>Twitter</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
