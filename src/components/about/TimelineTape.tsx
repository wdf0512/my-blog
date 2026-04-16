'use client';

import styles from './TimelineTape.module.css';

const MILESTONES = [
  { year: '2020', desc: 'First line of code' },
  { year: '2022', desc: 'First dev projects (Creatify.ai)' },
  { year: '2023', desc: 'First full-time dev role — Shanghai & Sydney' },
  { year: '2024', desc: 'Pivoted to AI engineering — LangGraph & LLMs' },
  { year: 'Now', desc: 'Agentic ERP & multi-agent systems', isNow: true },
];

// Duplicate for seamless infinite loop (animation goes -50%)
const CARDS = [...MILESTONES, ...MILESTONES];

export function TimelineTape() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />

      <div className={styles.track}>
        {CARDS.map((card, i) => (
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
