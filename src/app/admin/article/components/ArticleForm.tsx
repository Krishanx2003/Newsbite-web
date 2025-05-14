'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@/lib/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { slugify } from '@/lib/utils';

interface FormData {
  title: string;
  subtitle: string;
  slug: string;
  meta_description: string;
  keywords: string;
  author_name: string;
  author_avatar: string;
  date: string;
  read_time: string;
  category: string;
  content: string;
  tags: string[];
  image_url: string;
  image_alt_text: string;
  status: 'draft' | 'publish' | 'scheduled';
  scheduled_date: string;
}

const ArticleForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subtitle: '',
    slug: '',
    meta_description: '',
    keywords: '',
    author_name: 'Unknown',
    author_avatar: 'https://example.com/default-avatar.jpg',
    date: new Date().toISOString().split('T')[0],
    read_time: '1 min read',
    category: '',
    content: '',
    tags: [],
    image_url: '',
    image_alt_text: '',
    status: 'draft',
    scheduled_date: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState<string[]>(['News', 'Technology', 'Lifestyle']);
  const [availableTags, setAvailableTags] = useState<string[]>(['tech', 'news', 'trending']);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const articleId = searchParams.get('id');

  // Fetch user and check admin role
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Unauthorized: Please log in');
        router.push('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, display_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        setError('Forbidden: Admin access required');
        router.push('/admin/dashboard');
        return;
      }

      setIsAdmin(true);
      setFormData((prev) => ({
        ...prev,
        author_name: profile.display_name || user.email || 'Unknown',
        author_avatar: profile.avatar_url || 'https://example.com/default-avatar.jpg',
      }));
    };
    fetchUser();
  }, [router, supabase]);

  // Fetch article if editing
  useEffect(() => {
    if (!articleId) return;

    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles?id=${articleId}`);
        if (!response.ok) throw new Error(`Failed to fetch article: ${response.status}`);
        const { article } = await response.json();
        setFormData({
          title: article.title || '',
          subtitle: article.subtitle || '',
          slug: article.slug || '',
          meta_description: article.meta_description || '',
          keywords: article.keywords || '',
          author_name: article.author_name || 'Unknown',
          author_avatar: article.author_avatar || 'https://example.com/default-avatar.jpg',
          date: article.date ? new Date(article.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          read_time: article.read_time || '1 min read',
          category: article.category || '',
          content: article.content || '',
          tags: article.tags || [],
          image_url: article.image_url || '',
          image_alt_text: article.image_alt_text || '',
          status: article.status || 'draft',
          scheduled_date: article.scheduled_date
            ? new Date(article.scheduled_date).toISOString().slice(0, 16)
            : '',
        });
        setImagePreview(article.image_url || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
        toast.error('Error fetching article');
      }
    };
    fetchArticle();
  }, [articleId]);

  // Calculate read time
  useEffect(() => {
    const words = formData.content.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200) || 1;
    setFormData((prev) => ({ ...prev, read_time: `${minutes} min read` }));
  }, [formData.content]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || '' }));
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug ? prev.slug : slugify(title),
    }));
  };

  const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
    const lastTag = tags[tags.length - 1];
    if (lastTag && !availableTags.includes(lastTag)) {
      setAvailableTags((prev) => [...prev, lastTag]);
    }
  };

  const handleTagSelect = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setError('Invalid image type. Please upload JPEG, PNG, or GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit.');
      return;
    }

    setImageFile(file);
    setUploadProgress(0);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    };
    reader.readAsDataURL(file);
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content: content || '' }));
  };

  const handleStatusChange = (status: 'draft' | 'publish' | 'scheduled') => {
    setFormData((prev) => ({
      ...prev,
      status,
      scheduled_date: status === 'scheduled' && !prev.scheduled_date
        ? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 16)
        : status !== 'scheduled' ? '' : prev.scheduled_date,
    }));
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
      setFormData((prev) => ({ ...prev, category: newCategory }));
      setNewCategory('');
      setShowNewCategoryModal(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title) throw new Error('Title is required');
      if (!formData.subtitle) throw new Error('Subtitle is required');
      if (!formData.slug) throw new Error('Slug is required');
      if (!formData.author_name) throw new Error('Author name is required');
      if (!formData.author_avatar) throw new Error('Author avatar is required');
      if (!formData.date) throw new Error('Date is required');
      if (!formData.read_time) throw new Error('Read time is required');
      if (!formData.category) throw new Error('Category is required');
      if (!formData.content) throw new Error('Content is required');
      if (!formData.tags.length) throw new Error('At least one tag is required');

      let image_url = formData.image_url;
      if (imageFile) {
        const fileName = `article-images/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data } = supabase.storage.from('article-images').getPublicUrl(fileName);
        image_url = data.publicUrl;
      }
      if (!image_url) {
        throw new Error('Please provide an article image');
      }

      if (formData.status === 'scheduled' && !formData.scheduled_date) {
        throw new Error('Scheduled date is required for scheduled articles');
      }

      const submissionData = {
        title: formData.title,
        subtitle: formData.subtitle,
        slug: formData.slug,
        meta_description: formData.meta_description || undefined,
        keywords: formData.keywords || undefined,
        author: { name: formData.author_name, avatar: formData.author_avatar },
        date: formData.date,
        read_time: formData.read_time,
        category: formData.category,
        content: formData.content,
        tags: formData.tags,
        image_url,
        image_alt_text: formData.image_alt_text || undefined,
        status: formData.status,
        scheduled_date: formData.status === 'scheduled' ? formData.scheduled_date : undefined,
      };

      const response = await fetch(`/api/articles${articleId ? `?id=${articleId}` : ''}`, {
        method: articleId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const { error, details } = await response.json();
        throw new Error(details ? `${error}: ${details.map((d: any) => d.message).join(', ')}` : error);
      }

      toast.success(`Article ${formData.status === 'publish' ? 'published' : formData.status === 'scheduled' ? 'scheduled' : 'saved as draft'} successfully!`);
      setTimeout(() => router.push('/admin/articles'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit article');
      toast.error(err instanceof Error ? err.message : 'Failed to submit article');
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{articleId ? 'Edit Article' : 'Create Article'}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Meta Description</label>
          <textarea
            name="meta_description"
            value={formData.meta_description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Keywords</label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <div className="flex gap-2">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategoryModal(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Add New
            </button>
          </div>
        </div>

        {showNewCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Add New Category</h3>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter new category"
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCategoryModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={(e) => handleContentChange(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={6}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Tags</label>
          <input
            type="text"
            value={formData.tags.join(', ')}
            onChange={handleTagInput}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter tags, separated by commas"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagSelect(tag)}
                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter((tag) => !formData.tags.includes(tag))
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Article Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/gif"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-500 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="w-32 h-auto rounded-md" />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Image Alt Text</label>
          <input
            type="text"
            name="image_alt_text"
            value={formData.image_alt_text}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-8 mb-6 border-t pt-6 border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Publishing Options</h3>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value as 'draft' | 'publish' | 'scheduled')}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          {formData.status === 'scheduled' && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Scheduled Date</label>
              <input
                type="datetime-local"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 rounded-full text-white transition-colors ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            {isLoading ? 'Submitting...' : articleId ? 'Update Article' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;