'use client';

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call - replace with your actual newsletter service
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-20 max-w-4xl">
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 border border-primary/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black mb-4 text-text-primary">
            Join the Newsletter
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Get the latest articles, tutorials, and insights delivered straight to your inbox.
            No spam, unsubscribe anytime.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 px-4 py-3 bg-background rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {status === 'loading' ? (
                'Subscribing...'
              ) : status === 'success' ? (
                '✓ Subscribed!'
              ) : (
                <>
                  Subscribe
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-red-500 text-sm mt-2 text-center">
              Something went wrong. Please try again.
            </p>
          )}
        </form>

        <p className="text-text-muted text-sm text-center mt-6">
          Join 1,000+ developers already subscribed
        </p>
      </div>
    </section>
  );
}
