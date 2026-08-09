'use client';

import { useEffect, useState, useRef } from 'react';
import { ListOrdered, X } from 'lucide-react';
import type { DigestLang } from '@/lib/issues';

type TocItem = {
  id: string;
  title: string;
  ordinal: number;
};

const COPY = {
  en: { inThisIssue: 'In this issue', close: 'Close', open: 'Open table of contents' },
  zh: { inThisIssue: '本期内容', close: '关闭', open: '打开目录' },
} as const;

type Props = { locale?: DigestLang };

/** Sticky animated TOC for digest detail page.
 *  Desktop (≥lg): right-side rail.
 *  Mobile: floating chip → slide-in drawer. */
export function SidebarTOC({ locale = 'en' }: Props) {
  const copy = COPY[locale];
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Populate items from rendered DOM (digest h2 items only)
  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(
      'article .digest-item-heading[id]',
    );
    const parsed = [...headings].map((h, i) => ({
      id: h.id,
      title: (h.dataset.title || h.textContent || '').trim(),
      ordinal: Number(h.dataset.ordinal || i + 1),
    }));
    setItems(parsed);
  }, []);

  // Active-section tracking via IntersectionObserver
  useEffect(() => {
    if (items.length === 0) return;
    observerRef.current?.disconnect();
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    let lastActive: string | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({ id: e.target.id, top: e.boundingClientRect.top }))
          .sort((a, b) => a.top - b.top);
        if (visible[0]) {
          const next = visible[0].id;
          if (next !== lastActive) {
            lastActive = next;
            setActiveId(next);
          }
        }
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: [0, 1] },
    );
    headings.forEach((h) => observer.observe(h));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [items]);

  const scrollToItem = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    setDrawerOpen(false);
  };

  if (items.length === 0) return null;

  const activeOrdinal =
    items.find((i) => i.id === activeId)?.ordinal ?? items[0]?.ordinal ?? 1;

  return (
    <>
      {/* Desktop rail */}
      <nav
        aria-label="Items in this issue"
        className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pl-6 border-l border-border"
      >
        <p className="digest-mono-eyebrow mb-4 text-text-muted">
          {copy.inThisIssue} · {items.length}
        </p>
        <ul className="space-y-3.5">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id} className="relative">
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-[25px] top-0.5 w-[3px] h-5 bg-primary rounded-full"
                  />
                )}
                <button
                  onClick={() => scrollToItem(item.id)}
                  className={`group flex items-start gap-2 text-left w-full transition-colors ${
                    isActive
                      ? 'text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] tabular-nums mt-1 shrink-0 ${
                      isActive ? 'text-primary' : 'text-text-muted/70'
                    }`}
                  >
                    {String(item.ordinal).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-sm leading-snug line-clamp-2 ${
                      isActive ? 'font-semibold' : ''
                    }`}
                  >
                    {item.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile chip */}
      <button
        aria-label={copy.open}
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden fixed right-4 bottom-6 z-30 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-text-primary text-background shadow-lg font-mono text-xs tabular-nums hover:scale-105 active:scale-95 transition-transform"
      >
        <ListOrdered className="w-3.5 h-3.5" aria-hidden="true" />
        <span>
          № {String(activeOrdinal).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
      </button>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <button
            aria-label={copy.close}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-surface border-l border-border shadow-2xl overflow-y-auto animate-[slide-in_220ms_cubic-bezier(0.22,1,0.36,1)]">
            <div className="sticky top-0 bg-surface/95 backdrop-blur px-5 py-4 border-b border-border flex items-center justify-between">
              <p className="digest-mono-eyebrow">In this issue · {items.length}</p>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close table of contents"
                className="p-1 rounded-md hover:bg-border/40"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <ul className="p-5 space-y-4">
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToItem(item.id)}
                      className={`flex items-start gap-3 text-left w-full ${
                        isActive ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      <span
                        className={`font-mono text-xs tabular-nums shrink-0 mt-1 ${
                          isActive ? 'text-primary' : 'text-text-muted'
                        }`}
                      >
                        {String(item.ordinal).padStart(2, '0')}
                      </span>
                      <span
                        className={`text-[15px] leading-snug ${
                          isActive ? 'font-bold' : ''
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
