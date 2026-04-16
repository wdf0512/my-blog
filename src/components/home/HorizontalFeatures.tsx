'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { posts } from '#/.velite';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { ScrambleText } from '@/components/ui/ScrambleText';

const FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

export function HorizontalFeatures() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useHorizontalScroll(wrapperRef, trackRef);

  const featuredPosts = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (featuredPosts.length === 0) return null;

  return (
    <section
      ref={wrapperRef}
      style={{
        overflow: 'hidden',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ padding: '3rem 2rem 2rem' }}>
        <h2
          className="font-display font-black text-text-primary"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.25rem' }}
        >
          <ScrambleText trigger duration={600}>
            Latest Articles
          </ScrambleText>
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 14, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Scroll to browse — or{' '}
          <Link href="/blog" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            view all
          </Link>
        </p>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '1.25rem',
          paddingLeft: '2rem',
          paddingRight: '4rem',
          paddingBottom: '3rem',
          width: 'max-content',
        }}
      >
        {featuredPosts.map((post) => {
          const date = new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                flexShrink: 0,
                width: 340,
                minHeight: 240,
                borderRadius: 16,
                background: 'var(--background)',
                border: '1px solid var(--border)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textDecoration: 'none',
                transition: 'box-shadow 200ms ease, transform 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 8px 24px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    marginBottom: 10,
                  }}
                >
                  {date} · {post.readingTime}
                </p>
                <h3
                  className="font-display font-black text-text-primary"
                  style={{ fontSize: 18, lineHeight: 1.25, marginBottom: 10 }}
                >
                  {post.title}
                </h3>
              </div>
              {post.description && (
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.description}
                </p>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 16,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--primary)',
                }}
              >
                Read article <ArrowRight size={12} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
