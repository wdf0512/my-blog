'use client';

import dynamic from 'next/dynamic';

const TimelineTape = dynamic(
  () => import('./TimelineTape').then((m) => m.TimelineTape),
  {
    ssr: false,
    loading: () => <div style={{ height: '176px', background: '#0a0e15' }} />,
  }
);

export function TimelineTapeLoader() {
  return <TimelineTape />;
}
