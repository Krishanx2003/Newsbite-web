'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/news';

interface CategoryFormProps {
  category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category?.name || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = category ? 'PATCH' : 'POST';
    const url = category ? `/api/categories/${category.id}` : '/api/categories/create';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      router.push('/admin/categories');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="p-2 bg-green-500 text-white rounded">
        {category ? 'Update' : 'Create'} Category
      </button>
    </form>
  );
}