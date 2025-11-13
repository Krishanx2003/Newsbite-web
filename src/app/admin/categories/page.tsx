"use client"

import { useState, useEffect } from "react"
import CategoryForm from "./_components/CategoryForm"
import CategoryList from "./_components/CategoryList"
import { Newspaper, TrendingUp, Database, Clock } from "lucide-react"

interface CategoryMetrics {
  totalCategories: number
  lastUpdated: string
  activeCategories: number
}

export default function CategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [metrics, setMetrics] = useState<CategoryMetrics>({
    totalCategories: 0,
    lastUpdated: "",
    activeCategories: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const categories = await response.json()
      const now = new Date()

      setMetrics({
        totalCategories: categories.length,
        lastUpdated:
          categories.length > 0
            ? new Date(Math.max(...categories.map((c: any) => new Date(c.created_at).getTime()))).toLocaleString()
            : "Never",
        activeCategories: categories.length,
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch metrics")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [refreshKey])

  const handleCategoryAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white font-medium">Categories</h1>
          </div>
          <p className="text-slate-400 text-base ml-11">
            Manage your news categories and organize your content inventory
          </p>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Total Categories Card */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Total Categories</p>
                <p className="text-4xl font-bold text-white">
                  {isLoading ? (
                    <span className="inline-block w-12 h-10 bg-slate-700 rounded animate-pulse"></span>
                  ) : (
                    metrics.totalCategories
                  )}
                </p>
                <p className="text-slate-500 text-xs mt-2">Active content categories</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Last Updated Card */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Last Updated</p>
                <p className="text-lg font-semibold text-white truncate">
                  {isLoading ? (
                    <span className="inline-block w-32 h-7 bg-slate-700 rounded animate-pulse"></span>
                  ) : (
                    metrics.lastUpdated
                  )}
                </p>
                <p className="text-slate-500 text-xs mt-2">Most recent change</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Active Categories Card */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Active Categories</p>
                <p className="text-4xl font-bold text-white">
                  {isLoading ? (
                    <span className="inline-block w-12 h-10 bg-slate-700 rounded animate-pulse"></span>
                  ) : (
                    metrics.activeCategories
                  )}
                </p>
                <p className="text-slate-500 text-xs mt-2">Ready to use</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          <CategoryForm onCategoryAdded={handleCategoryAdded} />
          <CategoryList key={refreshKey} />
        </div>
      </div>
    </div>
  )
}
