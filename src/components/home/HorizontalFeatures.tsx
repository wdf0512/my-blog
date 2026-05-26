'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { posts } from '#/.velite';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { ScrambleText } from '@/components/ui/ScrambleText';
import styles from './HorizontalFeatures.module.css';

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

      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '1.25rem',
          paddingLeft: '2rem',
          paddingRight: '4rem',
          paddingBottom: '3rem',
          width: 'max-content',
          willChange: 'transform',
          transform: 'translateZ(0)',
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
              className={styles.card}
            >
              <div>
                <p className={styles.eyebrow}>
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
                <p className={styles.desc}>{post.description}</p>
              )}
              <div className={styles.read}>
                Read article <ArrowRight size={12} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
