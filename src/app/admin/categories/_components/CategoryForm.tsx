"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"

interface CategoryFormProps {
  onCategoryAdded: () => void
}

export default function CategoryForm({ onCategoryAdded }: CategoryFormProps) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create category")
      }

      const category = await response.json()
      setName("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onCategoryAdded()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-slate-600/50">
      <div className="px-6 py-5 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/80 to-slate-800/40">
        <h3 className="text-lg font-semibold text-white">Add New Category</h3>
        <p className="mt-1 text-sm text-slate-400">Create a new category to organize your content</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur">
            <p className="text-sm text-green-400">Category created successfully!</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Enter category name (e.g., Technology, Politics)"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-blue-600/50 disabled:to-cyan-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Add Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
