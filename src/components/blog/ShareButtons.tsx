'use client';

import { useEffect, useState } from 'react';
import { Twitter, Linkedin, Facebook } from 'lucide-react';

type Props = {
  title: string;
  slug: string;
};

export function ShareButtons({ title, slug }: Props) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${window.location.origin}/blog/${slug}`);
  }, [slug]);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      icon: Twitter,
      label: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
    {
      icon: Facebook,
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-muted mr-2">Share:</span>
      {links.map(({ icon: Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="w-8 h-8 rounded-lg bg-surface hover:bg-primary/10 flex items-center justify-center transition-colors group"
        >
          <Icon className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
        </a>
      ))}
    </div>
  );
}
