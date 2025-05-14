import type { Metadata } from 'next';
import './globals.css';

// Load Google Fonts
import { Montserrat, Inter, Fredoka } from 'next/font/google';

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

// Default metadata (can be overridden by nested layouts)
export const metadata: Metadata = {
  title: 'Brevvy',
  keywords: 'news, articles, insights, brevvy',
  description: 'News that matters. Insights that drive action.',
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Inter:wght@400;500&family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${montserrat.variable} ${inter.variable} ${fredokaOne.variable} antialiased bg-off-white dark:bg-near-black text-gray-800 dark:text-gray-200`}
      >
        {children}
      </body>
    </html>
  );
}