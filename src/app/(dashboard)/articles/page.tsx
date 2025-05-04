"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/client";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from "lodash.debounce";

interface Article {
  id: string;
  title: string;
  subtitle: string;
  author_name: string;
  author_avatar: string;
  date: string;
  read_time: string;
  category: string;
  content: string;
  tags: string[];
  image_url: string;
}

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const supabase = createClient();

  // Fetch articles with pagination
  const fetchArticles = useCallback(async (pageNum: number, reset = false) => {
    try {
      setIsFetching(true);
      setError(null);
      
      const { data, error: supabaseError, count } = await supabase
        .from("articles")
        .select("*", { count: "exact" })
        .order("date", { ascending: false })
        .range((pageNum - 1) * 9, pageNum * 9 - 1);

      if (supabaseError) {
        throw supabaseError;
      }

      if (reset) {
        setArticles(data || []);
      } else {
        setArticles(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data?.length || 0) >= 9);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [supabase]);

  // Initial load
  useEffect(() => {
    fetchArticles(1, true);
  }, [fetchArticles]);

  // Load more articles when page changes
  useEffect(() => {
    if (page > 1) {
      fetchArticles(page);
    }
  }, [page, fetchArticles]);

  // Get unique categories for filter
  const categories = ["all", ...Array.from(new Set(articles.map(article => article.category)))];

  // Filter and search functionality
  useEffect(() => {
    let result = articles;
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(article => article.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.subtitle.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredArticles(result);
  }, [articles, searchQuery, selectedCategory]);

  // Debounced search
  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  // Handle scroll for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !== 
        document.documentElement.offsetHeight || 
        isFetching || 
        !hasMore
      ) {
        return;
      }
      setPage(prev => prev + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  // Loading skeleton
  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            {/* Search and filter skeleton */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full md:w-1/2"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full md:w-1/4"></div>
            </div>
            
            {/* Article grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="ml-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // // Error state
  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex flex-col items-center justify-center">
  //       <div className="max-w-md text-center">
  //         <div className="text-red-500 text-5xl mb-4">⚠️</div>
  //         <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
  //         <p className="mb-6">{error}</p>
  //         <button
  //           onClick={() => {
  //             setLoading(true);
  //             fetchArticles(1, true);
  //           }}
  //           className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <ToastContainer />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Articles</h1>
        
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search articles..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Articles grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`} passHref>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
                  {/* Lazy loaded image */}
                  <img
                    src={article.image_url}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold line-clamp-2">{article.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                      {article.subtitle}
                    </p>
                    <div className="flex items-center mt-4">
                      <img
                        src={article.author_avatar}
                        alt={article.author_name}
                        loading="lazy"
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {article.author_name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(article.date).toLocaleDateString()} · {article.read_time}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
       
      </div>
    </div>
  );
};

export default ArticlesPage;