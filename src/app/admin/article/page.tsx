'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaSignOutAlt, FaMoon, FaSun, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { createClient } from '@/lib/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  author_name: string;
  category: string;
  status: 'draft' | 'publish' | 'scheduled';
  scheduled_date: string | null;
  created_at: string;
  tags: string[];
}

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createClient();

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Check admin role and fetch articles
  useEffect(() => {
    const checkAdminAndFetch = async () => {
      // Admin role check is handled in middleware and layout
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Unauthorized: Please log in');
        router.push('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        setError('Forbidden: Admin access required');
        router.push('/admin/dashboard');
        return;
      }

      setIsAdmin(true);
      fetchArticles();
    };
    checkAdminAndFetch();
  }, [router, supabase]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = statusFilter ? `/api/articles?status=${statusFilter}` : '/api/articles';
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized');
        if (response.status === 403) throw new Error('Forbidden: Admin access required');
        throw new Error(`Failed to fetch articles: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data.articles)) throw new Error('Invalid articles data');
      setArticles(data.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      toast.error(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/articles?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to delete article');
      }
      setArticles(articles.filter((article) => article.id !== id));
      toast.success('Article deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
      toast.error(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const handleStatusChange = async (id: string, status: 'draft' | 'publish' | 'scheduled', scheduled_date?: string) => {
    try {
      const body = { id, status, ...(status === 'scheduled' && scheduled_date ? { scheduled_date } : {}) };
      const response = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to update status');
      }
      setArticles(articles.map((article) =>
        article.id === id ? { ...article, status, scheduled_date: status === 'scheduled' ? scheduled_date || null : null } : article
      ));
      toast.success(`Article status updated to ${status}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <ToastContainer />
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Articles</h1>
            <p className="text-sm mt-1">Manage articles</p>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search articles by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/3 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchArticles();
            }}
            className="w-full sm:w-1/4 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="publish">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/admin/article/new')}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
            >
              <FaPlus className="mr-2" /> New Article
            </button>
            <button
              onClick={fetchArticles}
              className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Articles List */}
        <section className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Articles</h2>
          {isLoading && (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-indigo-600" size={24} />
            </div>
          )}
          {!isLoading && filteredArticles.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
          )}
          {!isLoading && filteredArticles.length > 0 && (
            <ul className="space-y-4">
              {filteredArticles.map((article) => (
                <li key={article.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{article.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {article.subtitle}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Author: {article.author_name} | Category: {article.category} | Status: {article.status}
                        {article.status === 'scheduled' && article.scheduled_date && (
                          <span> (Scheduled: {new Date(article.scheduled_date).toLocaleString()})</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tags: {article.tags.join(', ')} | Created: {new Date(article.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/article/edit?id=${article.id}`)}
                        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <select
                        value={article.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as 'draft' | 'publish' | 'scheduled';
                          const scheduled_date = newStatus === 'scheduled'
                            ? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 16)
                            : undefined;
                          handleStatusChange(article.id, newStatus, scheduled_date);
                        }}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="publish">Publish</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
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