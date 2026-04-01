'use client';

import styles from './TimelineTape.module.css';

const MILESTONES = [
  { year: '2019', desc: 'First line of code' },
  { year: '2020', desc: 'First freelance project' },
  { year: '2022', desc: 'Launched this blog' },
  { year: '2024', desc: 'First SaaS shipped' },
  { year: 'Now', desc: 'AI tools & Three.js', isNow: true },
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
