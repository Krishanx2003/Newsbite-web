'use client';
import { Suspense, useState } from 'react';
import NewsFeed from './_components/NewsFeed';
import HeroSection from './_components/HeroSection';
import SearchBar from './_components/SearchBar';
import CategoryFilter from './_components/CategoryFilter';

export default function NewsPage() {
  const [filters, setFilters] = useState({
    date: undefined as Date | undefined,
    category: 'All',
  });

  const handleFilterChange = (newFilters: { date: Date | undefined; category: string }) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <HeroSection />

        {/* Search and Filters Section */}
        <div className="mb-12 mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-1/2">
            <Suspense fallback={
              <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            }>
              <SearchBar />
            </Suspense>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <CategoryFilter onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* News Feed */}
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8 max-w-5xl flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
                <span className="text-gray-500 font-medium">Loading top stories...</span>
              </div>
            </div>
          }
        >
          <NewsFeed filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}