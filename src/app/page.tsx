import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Welcome to Your Blog
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            A modern blog about React, AI, and web development with 3D visual
            effects.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
