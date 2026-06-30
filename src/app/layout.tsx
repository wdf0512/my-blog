import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { GSAPProvider } from '@/components/providers/GSAPProvider';
import { CursorTrailMount } from '@/components/ui/CursorTrailMount';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const clashDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/ClashDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashDisplay-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ClashDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
  display: 'swap',
  fallback: ['sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://defangweng.xyz'),
  title: {
    default: "Defang's Secret",
    template: "%s | Defang's Secret",
  },
  description:
    "Insights from a developer's journey - exploring tech, indie hacking, and web development",
  keywords: ['Defang Weng', 'web development', 'React', 'Next.js', 'indie hacking', 'tech blog'],
  authors: [{ name: 'Defang Weng', url: 'https://defangweng.xyz' }],
  creator: 'Defang Weng',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://defangweng.xyz',
    siteName: "Defang's Secret",
    title: "Defang's Secret",
    description:
      "Insights from a developer's journey - exploring tech, indie hacking, and web development",
    images: [
      {
        url: '/icons/tree.png',
        width: 512,
        height: 512,
        alt: "Defang's Secret",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Defang's Secret",
    description:
      "Insights from a developer's journey - exploring tech, indie hacking, and web development",
    images: ['/icons/tree.png'],
  },
  alternates: {
    canonical: 'https://defangweng.xyz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    shortcut: '/icons/favicon.ico',
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/tree.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/tree.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${clashDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <GSAPProvider>
            <CursorTrailMount />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </GSAPProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
