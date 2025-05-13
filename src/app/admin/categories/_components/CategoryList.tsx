'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Categories</h2>

      {isLoading && (
        <div className="text-gray-500 text-sm">Loading categories...</div>
      )}

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      {!isLoading && !error && categories.length === 0 && (
        <div className="text-gray-500 text-sm">No categories found.</div>
      )}

      {categories.length > 0 && (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="p-3 bg-gray-50 rounded-md text-gray-700"
            >
              {category.name}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={fetchCategories}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Refresh List
      </button>
    </div>
  );
}