import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display font-semibold mb-4">Your Blog</h3>
            <p className="text-text-secondary text-sm">
              Personal blog about React, AI, and modern web development.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Social</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-secondary">
          © {currentYear} Your Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
