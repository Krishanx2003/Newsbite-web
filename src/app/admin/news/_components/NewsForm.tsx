'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category, News } from '@/types/news';

interface NewsFormProps {
  news?: News;
  categories: Category[];
}

export default function NewsForm({ news, categories }: NewsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: news?.title || '',
    content: news?.content || '',
    category_id: news?.category_id || '',
    is_published: news?.is_published ?? false,
    published_at: news?.published_at?.slice(0, 16) || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = news ? 'PATCH' : 'POST';
    const url = news ? `/api/news/${news.id}` : '/api/news/create';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.push('/admin/news');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full p-2 border rounded"
          rows={6}
          required
        />
      </div>
      <div>
        <label className="block">Category</label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="mr-2"
          />
          Published
        </label>
      </div>
      {formData.is_published && (
        <div>
          <label className="block">Publish Date</label>
          <input
            type="datetime-local"
            value={formData.published_at}
            onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
      )}
      <button type="submit" className="p-2 bg-green-500 text-white rounded">
        {news ? 'Update' : 'Create'} News
      </button>
    </form>
  );
}