'use client';

import { useState, useEffect } from 'react';
import CategoryForm from "./_components/CategoryForm";
import CategoryList from "./_components/CategoryList";

interface CategoryMetrics {
  totalCategories: number;
  lastUpdated: string;
  activeCategories: number;
}

export default function CategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [metrics, setMetrics] = useState<CategoryMetrics>({
    totalCategories: 0,
    lastUpdated: '',
    activeCategories: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const categories = await response.json();
      const now = new Date();

      setMetrics({
        totalCategories: categories.length,
        lastUpdated: categories.length > 0
          ? new Date(Math.max(...categories.map((c: any) => new Date(c.created_at).getTime()))).toLocaleString()
          : 'Never',
        activeCategories: categories.length // Assuming all categories are active for now
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [refreshKey]);

  const handleCategoryAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your product categories and organize your inventory</p>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Categories</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {isLoading ? (
                        <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        metrics.totalCategories
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Last Updated</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {isLoading ? (
                        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        metrics.lastUpdated
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Categories</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {isLoading ? (
                        <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        metrics.activeCategories
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          <CategoryForm onCategoryAdded={handleCategoryAdded} />
          <CategoryList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}