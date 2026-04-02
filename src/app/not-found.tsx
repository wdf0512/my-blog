import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <p className="font-display text-[10rem] font-black leading-none text-primary/20 select-none">
        404
      </p>
      <h1 className="font-display text-3xl md:text-4xl font-black text-text-primary -mt-4 mb-3">
        Page not found
      </h1>
      <p className="text-text-secondary mb-8 max-w-sm">
        This page doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface hover:bg-primary/10 border border-border hover:border-primary/30 text-text-primary transition-all group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to home
      </Link>
    </div>
  );
}
