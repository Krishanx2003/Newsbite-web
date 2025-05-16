import { Footer } from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { BookmarkProvider } from '@/context/BookmarkContext';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brevvy',
  description: 'News that matters. Insights that drive action.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BookmarkProvider>
        <main className="pt-16">
          <Navbar />
          {children}
          <Footer />
        </main>
      </BookmarkProvider>
    </div>
  );
}