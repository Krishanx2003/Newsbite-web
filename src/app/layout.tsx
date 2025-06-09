// src\app\layout.tsx

import './globals.css';
import { Montserrat, Inter, Fredoka } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import SEO from '@/components/SEO';

const montserrat = Montserrat({
  weight: '700',
  variable: '--font-montserrat',
  subsets: ['latin'],
});

const inter = Inter({
  weight: ['400', '500'],
  variable: '--font-inter',
  subsets: ['latin'],
});

const fredokaOne = Fredoka({
  weight: '400',
  variable: '--font-fredoka',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NewsBite - Latest News and Updates',
  keywords: 'news, articles, insights, newsbite, breaking news, current events, world news',
  description: 'Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.',
  openGraph: {
    title: 'NewsBite - Latest News and Updates',
    description: 'Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.',
    url: 'https://newsbite.in',
    siteName: 'NewsBite',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'NewsBite',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewsBite - Latest News and Updates',
    description: 'Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.',
    images: ['/og-default.jpg'],
    creator: '@newsbite_in',
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
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${inter.variable} ${fredokaOne.variable} antialiased bg-off-white dark:bg-near-black text-gray-800 dark:text-gray-200`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}