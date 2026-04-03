'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Mail } from 'lucide-react';
import styles from './HeroTypewriter.module.css';
import btn from '@/styles/buttons.module.css';

const PHASE1 = "Hi, I'm DEFANG";
const DEFANG_START = PHASE1.indexOf('DEFANG');
const PHASE2 = 'DO WHAT YOU SET OUT TO DO \u2014 AND DO IT BETTER THAN BEFORE';
const DASH_IDX = PHASE2.indexOf('\u2014');

type Phase = 1 | 2;

function charDelay(char: string): number {
  if (char === '\u2014') return 420;   // dramatic pause at em dash
  if (char === ' ') return 60 + Math.random() * 30;
  return 85 + Math.random() * 35;     // natural variance per character
}

export function HeroTypewriter() {
  const [phase, setPhase] = useState<Phase>(1);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 1 && !isDeleting) {
      if (text.length < PHASE1.length) {
        timer = setTimeout(() => setText(PHASE1.slice(0, text.length + 1)), 85 + Math.random() * 35);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 900);
      }
    } else if (phase === 1 && isDeleting) {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), 55);
      } else {
        setIsDeleting(false);
        setPhase(2);
        setCharIdx(0);
      }
    } else if (!isDeleting) {
      // phase 2 — type character by character
      if (charIdx < PHASE2.length) {
        const delay = charDelay(PHASE2[charIdx]);
        timer = setTimeout(() => setCharIdx((i) => i + 1), delay);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 4500);
      }
    } else {
      // phase 2 — delete character by character
      if (charIdx > 0) {
        timer = setTimeout(() => setCharIdx((i) => i - 1), 50);
      } else {
        setIsDeleting(false);
        setPhase(1);
        setText('');
      }
    }

    return () => clearTimeout(timer);
  }, [phase, text, isDeleting, charIdx]);

  const renderContent = () => {
    if (phase === 1) {
      if (text.length <= DEFANG_START) return <span>{text}</span>;
      return (
        <>
          <span>{text.slice(0, DEFANG_START)}</span>
          <span className={styles.gold}>{text.slice(DEFANG_START)}</span>
        </>
      );
    }
    const displayed = PHASE2.slice(0, charIdx);
    if (displayed.length <= DASH_IDX) return <span>{displayed}</span>;
    return (
      <>
        <span>{displayed.slice(0, DASH_IDX)}</span>
        <span className={styles.gold}>{displayed.slice(DASH_IDX, DASH_IDX + 1)}</span>
        <span>{displayed.slice(DASH_IDX + 1)}</span>
      </>
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <div
          className={`${styles.headline} ${phase === 1 ? styles.phase1Color : styles.phase2Color}`}
        >
          {renderContent()}
          <span className={styles.cursor} aria-hidden="true" />
        </div>

        <div className={styles.buttons}>
          <Link href="/blog" className={btn.btnPrimary}>
            <span className={btn.btnLabel}>Read my articles</span>
            <span className={btn.btnKnob} aria-hidden>
              <ChevronRight className={btn.btnKnobIcon} strokeWidth={2.25} />
            </span>
          </Link>
          <a href="mailto:defangninj@outlook.com" className={btn.btnSecondary}>
            <Mail className={btn.btnSecondaryIcon} strokeWidth={2} aria-hidden />
            <span className={btn.btnLabel}>Say hello</span>
          </a>
        </div>
      </div>
    </section>
  );
}
