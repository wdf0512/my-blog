import type { Metadata } from 'next';
import { HeroTypewriterLoader } from '@/components/about/HeroTypewriterLoader';
import { TimelineTapeLoader } from '@/components/about/TimelineTapeLoader';
import { AboutSections } from '@/components/about/AboutSections';

export const metadata: Metadata = {
  title: 'About — Defang',
  description:
    "Developer, writer, and indie hacker. Learn about my story, journey, and what I'm doing now.",
};

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--background)' }}>
      <HeroTypewriterLoader />
      <TimelineTapeLoader />
      <AboutSections />
    </div>
  );
}
