'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ArrowUpRight, Copy, Check } from 'lucide-react';

type Props = {
  href: string;
  children?: ReactNode;
};

/** External-link wrapper for digest prose. Hover (≥320ms) shows a tiny
 *  preview popover with domain + readable URL + copy button. Skipped on touch. */
export function SourceLink({ href, children }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  // Treat any absolute http(s) URL as external — keeps SSR/hydration consistent.
  const isExternal = /^https?:\/\//i.test(href);

  let domain = '';
  let path = '';
  try {
    const u = new URL(href);
    domain = u.hostname.replace(/^www\./, '');
    path = (u.pathname + u.search).replace(/\/$/, '');
  } catch {
    /* relative or invalid URL — just render link without preview */
  }

  const onEnter = () => {
    if (!domain) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setPreviewOpen(true), 320);
  };
  const onLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPreviewOpen(false);
  };

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <span
      ref={wrapRef}
      className="relative inline-block"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="underline decoration-primary/40 underline-offset-[3px] decoration-1 hover:decoration-primary hover:text-primary transition-colors"
      >
        {children}
      </a>
      {previewOpen && domain && (
        <span
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-30 min-w-[14rem] max-w-[20rem] px-3 py-2.5 rounded-xl bg-text-primary text-background shadow-2xl text-xs font-mono leading-snug pointer-events-auto"
        >
          <span className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 truncate">
              <ArrowUpRight className="w-3 h-3 shrink-0 text-primary" aria-hidden="true" />
              <span className="font-bold text-primary truncate">{domain}</span>
            </span>
            <button
              onClick={copyLink}
              aria-label="Copy link"
              className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-background/70 hover:bg-background/15 hover:text-background transition-colors"
            >
              {copied ? (
                <Check className="w-3 h-3" aria-hidden="true" />
              ) : (
                <Copy className="w-3 h-3" aria-hidden="true" />
              )}
            </button>
          </span>
          {path && (
            <span className="block mt-1 text-background/60 truncate">{path || '/'}</span>
          )}
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-text-primary"
          />
        </span>
      )}
    </span>
  );
}
