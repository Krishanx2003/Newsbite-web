'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Category {
  id: number;
  name: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

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

  const handleEditClick = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditName('');
  };

  const handleEditSubmit = async (e: FormEvent, id: number) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/categories', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name: editName }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to update category');
      }

      const updatedCategory = await response.json();
      setCategories(categories.map((cat) => (cat.id === id ? updatedCategory : cat)));
      setEditingCategoryId(null);
      setEditName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
              className="p-3 bg-gray-50 rounded-md text-gray-700 flex items-center justify-between"
            >
              {editingCategoryId === category.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, category.id)} className="flex w-full space-x-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter category name"
                  />
                  <button
                    type="submit"
                    className="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span>{category.name}</span>
                  <button
                    onClick={() => handleEditClick(category)}
                    className="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </button>
                </>
              )}
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