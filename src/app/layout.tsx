// src\app\layout.tsx

import './globals.css';
import { Montserrat, Inter, Fredoka } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import SEO from '@/components/SEO';
import Script from 'next/script';

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
    google: 'ca-pub-3778747736249937',
    // yandex: 'your-yandex-verification',
  },
  other: {
    'google-adsense-account': 'ca-pub-3778747736249937',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${montserrat.variable} ${inter.variable} ${fredokaOne.variable} antialiased bg-background text-foreground font-sans`}
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