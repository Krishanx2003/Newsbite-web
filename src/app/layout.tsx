// src\app\layout.tsx

import './globals.css';
import { Montserrat, Inter, Fredoka } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';

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
  title: 'Brevvy',
  keywords: 'news, articles, insights, brevvy',
  description: 'News that matters. Insights that drive action.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
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
    </div>
  );
}