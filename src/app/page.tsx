import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { AboutSection } from '@/components/home/AboutSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedPosts />
      <AboutSection />
      <NewsletterSection />
    </>
  );
}
