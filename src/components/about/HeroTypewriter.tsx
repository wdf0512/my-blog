'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HeroTypewriter.module.css';

const PHASE1 = "Hi, I'm Defang";
const DEFANG_START = PHASE1.indexOf('Defang'); // 8
const PHASE2_WORDS = [
  'Do', 'what', 'you', 'set', 'out', 'to', 'do', '—',
  'And', 'do', 'it', 'better', 'than', 'before',
];

type Phase = 1 | 2;

export function HeroTypewriter() {
  const [phase, setPhase] = useState<Phase>(1);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 1 && !isDeleting) {
      if (text.length < PHASE1.length) {
        timer = setTimeout(() => setText(PHASE1.slice(0, text.length + 1)), 75);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 900);
      }
    } else if (phase === 1 && isDeleting) {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), 38);
      } else {
        setIsDeleting(false);
        setPhase(2);
        setWordIdx(0);
      }
    } else {
      // phase === 2
      if (wordIdx < PHASE2_WORDS.length) {
        timer = setTimeout(() => setWordIdx((i) => i + 1), 130);
      } else {
        timer = setTimeout(() => {
          setPhase(1);
          setText('');
          setWordIdx(0);
        }, 4500);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, text, isDeleting, wordIdx]);

  const renderContent = () => {
    if (phase === 1) {
      if (text.length <= DEFANG_START) {
        return <span>{text}</span>;
      }
      return (
        <>
          <span>{text.slice(0, DEFANG_START)}</span>
          <span className={styles.gold}>{text.slice(DEFANG_START)}</span>
        </>
      );
    }
    return <span>{PHASE2_WORDS.slice(0, wordIdx).join(' ')}</span>;
  };

  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.content}>

        <div
          className={`${styles.headline} ${phase === 1 ? styles.phase1Color : styles.phase2Color
            }`}
        >
          {renderContent()}
          <span className={styles.cursor} aria-hidden="true" />
        </div>

        <div className={styles.buttons}>
          <Link href="/blog" className={styles.btnPrimary}>
            Read my articles
          </Link>
          <a href="mailto:your@email.com" className={styles.btnSecondary}>
            Say hello
          </a>
        </div>
      </div>
    </section>
  );
}
