"use client";

import React, { useState, useEffect, type FormEvent } from "react";

interface News {
  id: string;
  title: string;
  content: string;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  image_url: string | null;
  image_file?: File | null;
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
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editIsPublished, setEditIsPublished] = useState(false);
  const [editPublishedAt, setEditPublishedAt] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    }
  };

  const handleEditClick = (item: News) => {
    setEditingNewsId(item.id);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditCategory(item.category || "");
    setEditIsPublished(item.is_published);
    setEditPublishedAt(item.published_at || "");
    setEditImageUrl(item.image_url || "");
    setEditImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingNewsId(null);
    setEditTitle("");
    setEditContent("");
    setEditCategory("");
    setEditIsPublished(false);
    setEditPublishedAt("");
    setEditImageUrl("");
    setEditImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditImageFile(file);
    if (file) setEditImageUrl("");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditImageUrl(e.target.value);
    if (e.target.value) setEditImageFile(null);
  };

  const handleEditSubmit = async (e: FormEvent, id: string) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", editTitle);
      formData.append("content", editContent);
      formData.append("category", editCategory || "");
      formData.append("is_published", editIsPublished.toString());
      if (editIsPublished && editPublishedAt)
        formData.append("published_at", editPublishedAt);
      if (editImageUrl) formData.append("image_url", editImageUrl);
      if (editImageFile) formData.append("image_file", editImageFile);

      const response = await fetch("/api/news", {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to update news");
      }

      const updatedNews = await response.json();
      setNews(news.map((n) => (n.id === id ? updatedNews : n)));
      handleCancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">News Articles</h2>
          <p className="text-slate-400 text-sm mt-1">
            {news.length} article{news.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchNews}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <div className="w-8 h-8 border-4 border-slate-600 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400">Loading news...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 rounded-xl p-4">
          {error}
        </div>
      )}

      {!isLoading && !error && news.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <p className="text-slate-400">
            No articles yet. Create your first one to get started.
          </p>
        </div>
      )}

      {/* 🧩 3-column Grid Layout */}
      {news.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition"
            >
              {editingNewsId === item.id ? (
                <form
                  onSubmit={(e) => handleEditSubmit(e, item.id)}
                  className="p-6 space-y-4"
                  encType="multipart/form-data"
                >
                  {/* Editing Form */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Content
                    </label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {item.title}
                  </h3>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-slate-300 text-sm line-clamp-2">
                    {item.content}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-slate-400">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString()
                        : "Unpublished"}
                    </span>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
