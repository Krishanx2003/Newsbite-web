"use client"

import type React from "react"

import { useState, useEffect, type FormEvent } from "react"

interface Category {
  name: string
}

export default function NewsForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [publishedAt, setPublishedAt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories")
      }
    }
    fetchCategories()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    if (file) setImageUrl("")
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
    if (e.target.value) setImageFile(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("category", category || "")
      formData.append("is_published", isPublished.toString())
      if (isPublished && publishedAt) {
        formData.append("published_at", publishedAt)
      }
      if (imageUrl) {
        formData.append("image_url", imageUrl)
      }
      if (imageFile) {
        formData.append("image_file", imageFile)
      }

      const response = await fetch("/api/news", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || "Failed to create news")
      }

      const news = await response.json()
      setSuccess(`News "${news.title}" created successfully!`)
      setTitle("")
      setContent("")
      setCategory("")
      setIsPublished(false)
      setPublishedAt("")
      setImageUrl("")
      setImageFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="sticky top-8 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Create News Article</h2>
        <p className="text-slate-400 text-sm mt-1">Add a new article to your news feed</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-200 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="Enter news title"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-slate-200 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
            placeholder="Enter news content"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-200 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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
          <label htmlFor="image_url" className="block text-sm font-semibold text-slate-200 mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="image_url"
            value={imageUrl}
            onChange={handleUrlChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
            placeholder="https://example.com/image.jpg"
            disabled={!!imageFile}
          />
        </div>

        <div>
          <label htmlFor="image_file" className="block text-sm font-semibold text-slate-200 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            id="image_file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 transition disabled:opacity-50"
            disabled={!!imageUrl}
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-700 border border-slate-600 accent-emerald-500 focus:ring-2 focus:ring-emerald-500 transition"
            />
            <span className="text-sm font-medium text-slate-200">Publish now</span>
          </label>
        </div>

        {isPublished && (
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
            <label htmlFor="publishedAt" className="block text-sm font-semibold text-slate-200 mb-2">
              Publish Date
            </label>
            <input
              type="datetime-local"
              id="publishedAt"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 text-sm rounded-lg p-3">{error}</div>
        )}
        {success && (
          <div className="bg-emerald-900/30 border border-emerald-700 text-emerald-200 text-sm rounded-lg p-3">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          {isLoading ? "Creating..." : "Create Article"}
        </button>
      </form>
    </div>
  )
}
