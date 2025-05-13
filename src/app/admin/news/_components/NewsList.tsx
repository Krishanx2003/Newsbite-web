'use client';

import { useState, useEffect, FormEvent } from 'react';

interface News {
  id: string;
  title: string;
  content: string;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
}

interface Category {
  name: string;
}

export default function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editIsPublished, setEditIsPublished] = useState(false);
  const [editPublishedAt, setEditPublishedAt] = useState('');

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    }
  };

  const handleEditClick = (item: News) => {
    setEditingNewsId(item.id);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditCategory(item.category || '');
    setEditIsPublished(item.is_published);
    setEditPublishedAt(item.published_at || '');
  };

  const handleCancelEdit = () => {
    setEditingNewsId(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
    setEditIsPublished(false);
    setEditPublishedAt('');
  };

  const handleEditSubmit = async (e: FormEvent, id: string) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/news', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: editTitle,
          content: editContent,
          category: editCategory || null,
          is_published: editIsPublished,
          published_at: editIsPublished && editPublishedAt ? editPublishedAt : null,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to update news');
      }

      const updatedNews = await response.json();
      setNews(news.map((item) => (item.id === id ? updatedNews : item)));
      setEditingNewsId(null);
      setEditTitle('');
      setEditContent('');
      setEditCategory('');
      setEditIsPublished(false);
      setEditPublishedAt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">News Articles</h2>

      {isLoading && (
        <div className="text-gray-500 text-sm">Loading news...</div>
      )}

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      {!isLoading && !error && news.length === 0 && (
        <div className="text-gray-500 text-sm">No news found.</div>
      )}

      {news.length > 0 && (
        <ul className="space-y-4">
          {news.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-gray-50 rounded-md text-gray-700"
            >
              {editingNewsId === item.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, item.id)} className="space-y-4">
                  <div>
                    <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="editTitle"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter news title"
                    />
                  </div>

                  <div>
                    <label htmlFor="editContent" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id="editContent"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      required
                      rows={5}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter news content"
                    />
                  </div>

                  <div>
                    <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700">
                      Category (Optional)
                    </label>
                    <select
                      id="editCategory"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editIsPublished}
                        onChange={(e) => setEditIsPublished(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      <span className="ml-2 text-sm text-gray-700">Publish News</span>
                    </label>
                  </div>

                  {editIsPublished && (
                    <div>
                      <label htmlFor="editPublishedAt" className="block text-sm font-medium text-gray-700">
                        Publish Date
                      </label>
                      <input
                        type="datetime-local"
                        id="editPublishedAt"
                        value={editPublishedAt}
                        onChange={(e) => setEditPublishedAt(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{item.content.substring(0, 100)}...</p>
                  <p className="text-sm text-gray-500">
                    Category: {item.category || 'None'} | Published: {item.is_published ? 'Yes' : 'No'}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={fetchNews}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Refresh List
      </button>
    </div>
  );
}