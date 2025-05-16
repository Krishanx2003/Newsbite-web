'use client';

import { useState, useEffect, FormEvent } from 'react';

interface News {
  id: string;
  title: string;
  content: string;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  image_url: string | null; // Added for image URL
  image_file?: File | null; // Added for image file (optional, not stored in DB)
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
  const [editImageUrl, setEditImageUrl] = useState(''); // Added for image URL
  const [editImageFile, setEditImageFile] = useState<File | null>(null); // Added for image file

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
    setEditImageUrl(item.image_url || ''); // Set image URL
    setEditImageFile(null); // Reset file input
  };

  const handleCancelEdit = () => {
    setEditingNewsId(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
    setEditIsPublished(false);
    setEditPublishedAt('');
    setEditImageUrl('');
    setEditImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditImageFile(file);
    if (file) setEditImageUrl(''); // Clear URL input if a file is selected
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditImageUrl(e.target.value);
    if (e.target.value) setEditImageFile(null); // Clear file input if a URL is provided
  };

  const handleEditSubmit = async (e: FormEvent, id: string) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('title', editTitle);
      formData.append('content', editContent);
      formData.append('category', editCategory || '');
      formData.append('is_published', editIsPublished.toString());
      if (editIsPublished && editPublishedAt) {
        formData.append('published_at', editPublishedAt);
      }
      if (editImageUrl) {
        formData.append('image_url', editImageUrl);
      }
      if (editImageFile) {
        formData.append('image_file', editImageFile);
      }

      const response = await fetch('/api/news', {
        method: 'PATCH',
        body: formData,
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
      setEditImageUrl('');
      setEditImageFile(null);
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
                <form onSubmit={(e) => handleEditSubmit(e, item.id)} className="space-y-4" encType="multipart/form-data">
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
                    <label htmlFor="editImageUrl" className="block text-sm font-medium text-gray-700">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="editImageUrl"
                      value={editImageUrl}
                      onChange={handleUrlChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter image URL"
                      disabled={!!editImageFile}
                    />
                  </div>

                  <div>
                    <label htmlFor="editImageFile" className="block text-sm font-medium text-gray-700">
                      Upload Image (Optional)
                    </label>
                    <input
                      type="file"
                      id="editImageFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      disabled={!!editImageUrl}
                    />
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
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
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