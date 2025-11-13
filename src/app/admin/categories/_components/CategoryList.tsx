"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Check, X, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  created_at: string
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editName, setEditName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchCategories = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch categories")
      }

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setEditName(category.name)
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setEditName("")
  }

  const handleUpdate = async (id: string) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name: editName }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update category")
      }

      const updatedCategory = await response.json()
      setCategories(categories.map((cat) => (cat.id === id ? updatedCategory : cat)))
      setEditingCategory(null)
      setEditName("")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete category")
      }

      setCategories(categories.filter((cat) => cat.id !== id))
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsDeleting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/80 to-slate-800/40">
          <h3 className="text-lg font-semibold text-white">Categories List</h3>
          <p className="mt-1 text-sm text-slate-400">All your content categories</p>
        </div>
        <div className="p-12 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin mb-3" />
          <p className="text-slate-400 text-sm">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/80 to-slate-800/40">
        <h3 className="text-lg font-semibold text-white">Categories List</h3>
        <p className="mt-1 text-sm text-slate-400">All your content categories</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border-b border-red-500/30">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {categories.length === 0 && !error ? (
        <div className="px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-slate-700/50 mb-4">
            <Loader2 className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-slate-300">No categories yet</h3>
          <p className="mt-2 text-sm text-slate-500">Get started by creating your first category above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/30 bg-slate-800/30">
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Category Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Created Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-700/20 transition-colors duration-150">
                  <td className="px-6 py-4">
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full max-w-xs px-3 py-2 bg-slate-700/50 border border-blue-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        placeholder="Enter category name"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                        <span className="font-medium text-white">{category.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">
                      {new Date(category.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingCategory?.id === category.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdate(category.id)}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 disabled:bg-green-500/10 text-green-400 rounded-lg text-sm font-medium transition-colors duration-150"
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-600/20 hover:bg-slate-600/30 disabled:bg-slate-600/10 text-slate-400 rounded-lg text-sm font-medium transition-colors duration-150"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors duration-150"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          disabled={isDeleting === category.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 disabled:bg-red-500/10 text-red-400 rounded-lg text-sm font-medium transition-colors duration-150"
                        >
                          {isDeleting === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
