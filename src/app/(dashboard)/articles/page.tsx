'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight, FaSearch, FaBookmark } from 'react-icons/fa';
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const articlesPerPage = 6;

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
          ...(searchQuery && { search: searchQuery }),
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
  }, [page, selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 dark:text-gray-300 font-inter font-medium">Loading articles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-red-600 font-inter max-w-md text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">


      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="md:flex md:justify-between md:items-center">
            <div className="mb-8 md:mb-0 md:max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold font-montserrat leading-tight">
                Discover Inspiring <br className="hidden md:inline" />
                <span className="text-yellow-300">Ideas & Insights</span>
              </h1>
              <p className="mt-4 text-lg font-inter text-blue-100 max-w-xl">
                Explore our collection of thought-provoking articles written by experts across various fields.
              </p>
            </div>
            <div className="relative w-full md:w-200 h-64 rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0  opacity-40 z-10 rounded-xl"></div>
              <Image
                src="/newsbite-banner.jpeg"
                alt="Blog hero image"
                fill
                className="object-cover"
                sizes="(max-width: 500px) 100vw, 1500px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
          <div className="md:flex md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-montserrat mb-2">Browse Articles</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                {selectedCategory ? `Showing articles in "${selectedCategory}"` : 'Showing all articles'} • Page {page} of {totalPages}
              </p>
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <div className="relative">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </form>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="pl-4 pr-8 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 font-inter appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Article */}
        {articles.length > 0 && (
          <div className="mb-16">
            <Link
              href={`/articles/${articles[0].id}`}
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="md:flex">
                <div className="md:w-2/5 lg:w-1/2 relative h-64 md:h-auto">
                  <Image
                    src={articles[0].image_url || '/placeholder.jpg'}
                    alt={articles[0].image_alt_text || articles[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 50vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white font-medium rounded-full text-xs uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 md:w-3/5 lg:w-1/2">
                  <div className="flex items-center mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium rounded-full text-xs">
                      {articles[0].category}
                    </span>
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(articles[0].date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold font-montserrat text-gray-900 dark:text-white mb-4">
                    {articles[0].title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 font-inter mb-6 line-clamp-3">
                    {articles[0].subtitle}
                  </p>
                  <div className="flex items-center">
                    <Image
                      src={articles[0].author_avatar}
                      alt={articles[0].author_name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{articles[0].author_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{articles[0].read_time} read</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={article.image_url || '/placeholder.jpg'}
                  alt={article.image_alt_text || article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/40"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium rounded-full text-xs">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-montserrat text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-inter mb-4 line-clamp-2">
                  {article.subtitle}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Image
                      src={article.author_avatar}
                      alt={article.author_name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {article.author_name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {article.read_time}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We couldn't find any articles matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                setPage(1);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="inline-flex items-center rounded-lg shadow-sm bg-white dark:bg-gray-800 overflow-hidden">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:text-gray-400 dark:disabled:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:cursor-not-allowed"
              >
                <FaArrowLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Only show nearby pages and first/last page
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center border-r border-gray-200 dark:border-gray-700 text-sm font-medium ${page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && page > 3) ||
                  (pageNum === totalPages - 1 && page < totalPages - 2)
                ) {
                  // Show ellipsis
                  return (
                    <span
                      key={pageNum}
                      className="w-10 h-10 flex items-center justify-center border-r border-gray-200 dark:border-gray-700 text-gray-400"
                    >
                      …
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 disabled:text-gray-400 dark:disabled:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:hover:bg-white dark:disabled:hover:bg-gray-800 disabled:cursor-not-allowed"
              >
                <FaArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
