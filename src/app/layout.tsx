// src/app/layout.tsx
import './globals.css';
import { Montserrat, Inter, Fredoka } from 'next/font/google';
import type { Metadata } from 'next';

import Script from 'next/script';

// ✅ Fonts
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

// ✅ Metadata (SEO Optimized)
export const metadata: Metadata = {
  title: {
    default: 'NewsBite - Latest News and Updates',
    template: '%s | NewsBite',
  },
  description:
    'Stay informed with the latest news, breaking stories, and in-depth analysis from around the world. Covering politics, business, tech, sports, entertainment, and more — all in one place.',
  keywords:
    'news, newsbite, latest news, breaking news, current events, world news, India news, business news, tech updates, trending news, politics, sports, global news',
  metadataBase: new URL('https://newsbite.in'),
  alternates: {
    canonical: 'https://www.newsbite.in/',
  },

  openGraph: {
    title: 'NewsBite - Latest News and Updates',
    description:
      'Stay updated with breaking stories and in-depth analysis across politics, business, tech, and more. Your daily dose of trusted news.',
    url: 'https://www.newsbite.in/',
    siteName: 'NewsBite',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'NewsBite - Latest News & Updates',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@newsbite_in',
    creator: '@newsbite_in',
    title: 'NewsBite - Latest News and Updates',
    description:
      'Stay updated with breaking stories, global insights, and trending topics from NewsBite.',
    images: ['/og-default.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  authors: [{ name: 'NewsBite', url: 'https://www.newsbite.in/' }],

  // ✅ Social Media Profiles for Knowledge Panel and SEO
  other: {
    'og:see_also': [
      'https://x.com/newsbite_in',
      'https://www.instagram.com/newsbite_in',
      'https://www.reddit.com/user/newsbite_in/',
      'https://www.youtube.com/@newsbite_in',
    ],
  },
};

// ✅ Root Layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* ✅ Google AdSense */}
    

        {/* ✅ JSON-LD Structured Data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'NewsBite',
              url: 'https://www.newsbite.in/',
              logo: 'https://www.newsbite.in/og-default.jpg',
              sameAs: [
                'https://x.com/newsbite_in',
                'https://www.instagram.com/newsbite_in',
                'https://www.reddit.com/user/newsbite_in/',
                'https://www.youtube.com/@newsbite_in',
              ],
            }),
          }}
        />
      </head>

      <body
        className={`${montserrat.variable} ${inter.variable} ${fredokaOne.variable} antialiased bg-background text-foreground font-sans`}
        suppressHydrationWarning
      >

          {children}

      </body>
    </html>
  );
}
