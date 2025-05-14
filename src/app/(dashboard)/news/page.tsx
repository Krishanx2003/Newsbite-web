'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaMoon, FaSun, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Define News type matching API schema
interface News {
  id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  is_published: boolean;
  author_id: string;
}

// Define API response type
interface NewsResponse {
  news: News[];
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const newsPerPage = 6;

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        const data: News[] = await response.json();

        // Validate response
        if (!Array.isArray(data)) {
          throw new Error('Invalid response: news is not an array');
        }

        // Filter by category if selected
        const filteredNews = selectedCategory
          ? data.filter((item) => item.category === selectedCategory && item.is_published)
          : data.filter((item) => item.is_published);

        // Paginate news
        const start = (page - 1) * newsPerPage;
        const end = start + newsPerPage;
        setNewsItems(filteredNews.slice(start, end));
        setTotalPages(Math.ceil(filteredNews.length / newsPerPage));

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.filter((item) => item.category).map((item) => item.category!)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [page, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-white dark:bg-near-black flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 font-inter">
          <FaArrowLeft className="animate-spin" size={24} />
          <span>Loading news...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-off-white dark:bg-near-black flex items-center justify-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md text-coral-500 font-inter">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white dark:bg-near-black text-gray-800 dark:text-gray-200 transition-colors duration-300">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-sm font-inter font-medium text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-transform duration-200 hover:scale-105"
            >
              <FaArrowLeft className="mr-2" /> Home
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-montserrat font-bold">News</h1>
              <p className="text-sm font-inter mt-1">Stay updated with the latest news</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-blue-600/50 hover:bg-blue-600/70 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-transform duration-200 hover:scale-105"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-8">
          <label className="block text-gray-700 dark:text-gray-300 font-inter font-medium mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 dark:text-gray-200 font-inter"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.id}`}
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-opacity duration-300"
            >
              <div className="p-4">
                <h3 className="text-xl font-montserrat font-bold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-base font-inter text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                  {news.content.substring(0, 100)}...
                </p>
                <div className="flex items-center mb-2">
                  <span className="text-xs font-inter text-gray-500 dark:text-gray-400">
                    {new Date(news.published_at || news.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })} • {news.category || 'Uncategorized'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-10">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-600 text-white font-fredoka rounded-md hover:bg-blue-600/80 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-transform duration-200 hover:scale-105"
            >
              <FaArrowLeft />
            </button>
            <span className="text-gray-700 dark:text-gray-300 font-inter">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-600 text-white font-fredoka rounded-md hover:bg-blue-600/80 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-transform duration-200 hover:scale-105"
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </main>

  
    </div>
  );
}