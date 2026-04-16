'use client';

import { useRef } from 'react';
import styles from './TimelineTape.module.css';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';

const MILESTONES = [
  { year: '2020', desc: 'First line of code' },
  { year: '2022', desc: 'First dev projects (Creatify.ai)' },
  { year: '2023', desc: 'First full-time dev role — Shanghai & Sydney' },
  { year: '2024', desc: 'Pivoted to AI engineering — LangGraph & LLMs' },
  { year: 'Now',  desc: 'Agentic ERP & multi-agent systems', isNow: true },
];

export function TimelineTape() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useHorizontalScroll(wrapperRef, trackRef);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />

      <div ref={trackRef} className={styles.track}>
        {MILESTONES.map((card, i) => (
          <div key={i} className={styles.slice}>
            <div className={styles.sprocketRow}>
              <div className={styles.sprocket} />
            </div>
            <div className={`${styles.card} ${card.isNow ? styles.cardNow : ''}`}>
              <div className={`${styles.year} ${card.isNow ? styles.yearNow : ''}`}>
                {card.year}
              </div>
              <div className={styles.desc}>{card.desc}</div>
            </div>
            <div className={styles.sprocketRow}>
              <div className={styles.sprocket} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
