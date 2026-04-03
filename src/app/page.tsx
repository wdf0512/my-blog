import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { AboutSection } from '@/components/home/AboutSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export default function Home() {
  return (
    <>
      <HeroSection />
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
