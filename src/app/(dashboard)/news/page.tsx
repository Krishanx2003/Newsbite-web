'use client';
import { Suspense } from 'react';
import NewsFeed from './_components/NewsFeed';
import HeroSection from './_components/HeroSection';

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-6 max-w-5xl flex items-center justify-center h-64">
  <div className="flex flex-col items-center space-y-4">
    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    <span className="text-muted-foreground font-medium">Loading top stories...</span>
  </div>
</div>
        }
      >
        <NewsFeed />

        <HeroSection />
      </Suspense>
    </div>
  );
}