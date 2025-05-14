'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaMoon, FaSun, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

// Define Article type matching API schema
interface Article {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  image_url: string;
  image_alt_text?: string;
  category: string;
  tags: string[];
  date: string;
  read_time: string;
  author_name: string;
  author_avatar: string;
}

// Define API response type
interface ArticlesResponse {
  articles: Article[];
  totalPages: number;
  currentPage: number;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const articlesPerPage = 6;

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: articlesPerPage.toString(),
          ...(selectedCategory && { category: selectedCategory }),
        });
        const response = await fetch(`/api/articles?${params}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.status}`);
        }
        const data: ArticlesResponse = await response.json();
        
        // Validate response
        if (!Array.isArray(data.articles)) {
          throw new Error('Invalid response: articles is not an array');
        }

        setArticles(data.articles);
        setTotalPages(data.totalPages || 1);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.articles.map((a) => a.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <FaArrowLeft className="animate-spin" size={24} />
          <span>Loading articles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-sm font-medium hover:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaArrowLeft className="mr-2" /> Home
            </button>
            <div>
              <h1 className="text-3xl font-bold">Articles</h1>
              <p className="text-sm mt-1">Explore our latest news and insights</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={article.image_url || '/placeholder.jpg'}
                  alt={article.image_alt_text || article.title}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{article.subtitle}</p>
                <div className="flex items-center mb-2">
                  <Image
                    src={article.author_avatar}
                    alt={article.author_name}
                    width={24}
                    height={24}
                    className="rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {article.author_name} • {article.date} • {article.read_time}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                 {article.tags.slice(0, 3).map((tag, index) => (
  <span
    key={`${tag}-${index}`}
    className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs"
  >
    {tag}
  </span>
))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-indigo-600 disabled:cursor-not-allowed"
            >
              <FaArrowLeft />
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-indigo-600 disabled:cursor-not-allowed"
            >
              <FaArrowRight />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-800 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 News Polls. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}