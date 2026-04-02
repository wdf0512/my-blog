import type { Metadata } from 'next';
import { Github, Twitter, Mail } from 'lucide-react';
import { HeroTypewriterLoader } from '@/components/about/HeroTypewriterLoader';
import { TimelineTapeLoader } from '@/components/about/TimelineTapeLoader';
import { FadeIn } from '@/components/animations/FadeIn';

export const metadata: Metadata = {
  title: 'About — Defang',
  description:
    "Developer, writer, and indie hacker. Learn about my story, journey, and what I'm doing now.",
};

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
    icon: '🔨',
    label: 'Building',
    desc: "AI-powered writing tools and exploring the boundaries of what's possible with LLMs.",
  },
  {
    icon: '📖',
    label: 'Learning',
    desc: 'Going deeper on WebGL shaders and advanced Three.js techniques.',
  },
  {
    icon: '✍️',
    label: 'Writing',
    desc: 'Regular articles on React patterns, indie hacking, and creative coding.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--background)' }}>
      {/* ── Section 1: Hero ── */}
      <HeroTypewriterLoader />

      {/* ── Section 2: My Story ── */}
      <section
        className="px-4 md:px-8 py-12 md:py-20"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-[960px] mx-auto">
          <FadeIn>
            <p className="mb-8" style={SECTION_LABEL}>My Story</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
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
                &ldquo;I fell in love with coding in 2019 and never looked back.&rdquo;
              </p>
              <div
                className="flex flex-col gap-4"
                style={{ fontFamily: FONT, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75 }}
              >
                <p style={{ margin: 0 }}>
                  What started as curiosity turned into a full career. I&apos;m self-taught,
                  which means I&apos;ve always had to learn by building — and that&apos;s
                  exactly how I like it.
                </p>
                <p style={{ margin: 0 }}>
                  When I&apos;m not shipping code, I&apos;m experimenting with 3D graphics,
                  writing about my experiences, or working on my next side project.
                </p>
                <p style={{ margin: 0 }}>
                  I believe in learning in public and sharing everything freely with the
                  community.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Section 3: Timeline ── */}
      <TimelineTapeLoader />

      {/* ── Section 4: What I'm Doing Now ── */}
      <section
        className="px-4 md:px-8 py-12 md:py-20"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-[960px] mx-auto">
          <FadeIn>
            <p className="mb-8" style={SECTION_LABEL}>What I&apos;m Doing Now</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {NOW_ITEMS.map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '24px 20px',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>{item.icon}</div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Section 5: Contact ── */}
      <section
        className="px-4 md:px-8 py-12 md:py-20 text-center"
        style={{ background: 'var(--background)', borderTop: '1px solid var(--border)' }}
      >
        <FadeIn>
          <p className="mb-4" style={SECTION_LABEL}>Let&apos;s Talk</p>
          <p
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
            className="mb-8"
            style={{ fontFamily: FONT, fontSize: '15px', color: 'var(--text-secondary)' }}
          >
            I&apos;m always open to interesting projects, collabs, or just a chat.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:defangninj@outlook.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '980px',
                background: 'var(--primary)',
                color: '#000',
                fontWeight: 700,
                fontSize: '15px',
                fontFamily: FONT,
                textDecoration: 'none',
              }}
            >
              <Mail size={16} />
              defangninj@outlook.com
            </a>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '980px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '15px',
                fontFamily: FONT,
                textDecoration: 'none',
              }}
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '980px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '15px',
                fontFamily: FONT,
                textDecoration: 'none',
              }}
            >
              <Twitter size={16} />
              Twitter
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
