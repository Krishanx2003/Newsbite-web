'use client';
import NewsFeed from './_components/NewsFeed';
export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <NewsFeed />
    </div>
  );
}