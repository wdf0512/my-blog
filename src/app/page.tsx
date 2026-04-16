import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { AboutSection } from '@/components/home/AboutSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { HorizontalFeatures } from '@/components/home/HorizontalFeatures';

export default function Home() {
  return (
    <>
      <HeroSection />
      <HorizontalFeatures />
      <ScrollReveal>
        <FeaturedPosts />
      </ScrollReveal>
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal>
        <NewsletterSection />
      </ScrollReveal>
    </>
  );
}
