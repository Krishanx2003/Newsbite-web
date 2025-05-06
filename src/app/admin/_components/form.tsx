"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { createClient } from "@/lib/client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "./InputField";
import RichTextEditor from "./RichTextEditor";
import ToggleSwitch from "./ToggleSwitch";
import { slugify } from "@/lib/utils";

interface FormData {
  title: string;
  subtitle: string;
  slug: string;
  metaDescription?: string;
  keywords?: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  category: string;
  content: string;
  tags: string[];
  imageFile: File | null;
  imageUrl: string;
  status: "draft" | "publish" | "scheduled";
  scheduledDate?: string;
}



const ArticleForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subtitle: "",
    slug: "",
    metaDescription: "",
    keywords: "",
    author: {
      name: "",
      avatar: "",
    },
    date: new Date().toISOString().split("T")[0],
    readTime: "",
    category: "",
    content: "",
    tags: [],
    imageFile: null,
    imageUrl: "",
    status: "draft",
    scheduledDate: "",
  });

  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setArticleId(id);
      const fetchArticle = async () => {
        try {
          const response = await fetch(`/api/article?id=${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch article");
          }
          const article = await response.json();
          setFormData({
            title: article.title,
            subtitle: article.subtitle,
            slug: article.slug,
            metaDescription: article.metaDescription || "",
            keywords: article.keywords || "",
            author: {
              name: article.author_name,
              avatar: article.author_avatar,
            },
            date: new Date(article.date).toISOString().split("T")[0],
            readTime: article.read_time,
            category: article.category,
            content: article.content,
            tags: article.tags || [],
            imageFile: null,
            imageUrl: article.image_url,
            status: article.status,
            scheduledDate: article.scheduled_date
              ? new Date(article.scheduled_date).toISOString().slice(0, 16)
              : "",
          });
          setIsPublished(article.status === "publish" || article.status === "scheduled");
          setIsScheduled(article.status === "scheduled");
          setImagePreview(article.image_url);
        } catch (error) {
          toast.error("Error fetching article");
          console.error(error);
        }
      };
      fetchArticle();
    }
  }, [searchParams]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("author.")) {
      const key = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        author: {
          ...prevData.author,
          [key]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    setFormData((prevData) => ({
      ...prevData,
      slug: slugify(e.target.value),
    }));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        imageFile: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prevData) => ({
      ...prevData,
      content,
    }));
  };

  const handlePublishToggle = () => {
    const newPublishState = !isPublished;
    setIsPublished(newPublishState);

    let newStatus: "draft" | "publish" | "scheduled" = newPublishState ? "publish" : "draft";

    if (!newPublishState) {
      setIsScheduled(false);
    } else if (isScheduled) {
      newStatus = "scheduled";
    }

    setFormData((prevData) => ({
      ...prevData,
      status: newStatus,
    }));
  };

  const handleScheduleToggle = () => {
    const newScheduleState = !isScheduled;
    setIsScheduled(newScheduleState);

    const newStatus: "draft" | "publish" | "scheduled" = newScheduleState ? "scheduled" : "publish";

    setFormData((prevData) => ({
      ...prevData,
      status: newStatus,
    }));

    if (newScheduleState && !formData.scheduledDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setFormData((prevData) => ({
        ...prevData,
        scheduledDate: tomorrow.toISOString().slice(0, 16),
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        const fileName = `article-images/${Date.now()}-${formData.imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("article-images")
          .upload(fileName, formData.imageFile);

        if (uploadError) {
          toast.error("Error uploading image: " + uploadError.message);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("article-images")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      } else if (!formData.imageUrl) {
        toast.error("Please select an image file");
        return;
      }

      if (formData.status === "scheduled" && !formData.scheduledDate) {
        toast.error("Please select a date for scheduled publication");
        return;
      }

      const submissionData = {
        ...formData,
        imageUrl,
      };

      if (submissionData.status !== "scheduled") {
        delete submissionData.scheduledDate;
      }

      const method = articleId ? "PUT" : "POST";
      const url = articleId ? `/api/article?id=${articleId}` : "/api/article";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Error submitting article");
        return;
      }

      toast.success(
        `Article ${
          formData.status === "publish"
            ? "published"
            : formData.status === "scheduled"
            ? "scheduled"
            : "saved as draft"
        } successfully!`
      );

      setTimeout(() => {
        router.push("/admin/articles");
      }, 2000);
    } catch (error) {
      toast.error("Network error: Please try again later");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <ToastContainer />
      {isPreview ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Article Preview</h2>
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
            >
              Back to Edit
            </button>
          </div>

          <div className="preview-content">
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.status === "publish"
                    ? "bg-green-100 text-green-800"
                    : formData.status === "scheduled"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {formData.status === "publish"
                  ? "Published"
                  : formData.status === "scheduled"
                  ? "Scheduled"
                  : "Draft"}
              </span>
              {formData.status === "scheduled" && formData.scheduledDate && (
                <span className="ml-2 text-sm text-gray-500">
                  Scheduled for: {new Date(formData.scheduledDate).toLocaleString()}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">{formData.subtitle}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Slug: {formData.slug}</p>
            {formData.metaDescription && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Meta Description: {formData.metaDescription}
              </p>
            )}
            {formData.keywords && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Keywords: {formData.keywords}
              </p>
            )}

            <div className="flex items-center mb-6">
              {formData.author.avatar && (
                <img
                  src={formData.author.avatar}
                  alt={formData.author.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              )}
              <div>
                <p className="font-medium">{formData.author.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.date} · {formData.readTime}
                </p>
              </div>
            </div>

            {imagePreview && (
              <div className="mb-6">
                <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg" />
              </div>
            )}

            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />

            {formData.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{articleId ? "Edit Article" : "Create New Article"}</h2>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
            >
              Preview
            </button>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <InputField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
          />

          <InputField
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            required
          />

          <InputField
            label="Slug (URL)"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />

          <InputField
            label="Meta Description"
            name="metaDescription"
            value={formData.metaDescription || ""}
            onChange={handleChange}
          />

          <InputField
            label="Keywords (comma-separated)"
            name="keywords"
            value={formData.keywords || ""}
            onChange={handleChange}
          />

          <InputField
            label="Author Name"
            name="author.name"
            value={formData.author.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Author Avatar URL"
            name="author.avatar"
            value={formData.author.avatar}
            onChange={handleChange}
            type="url"
            required
          />

          <InputField
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            type="date"
            required
          />

          <InputField
            label="Read Time"
            name="readTime"
            value={formData.readTime}
            onChange={handleChange}
            required
          />

          <InputField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Content</label>
            <RichTextEditor value={formData.content} onChange={handleContentChange} />
          </div>

          <InputField
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags.join(", ")}
            onChange={handleTagsChange}
            required
          />

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Article Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Image Preview" className="w-32 h-auto rounded-md" />
              </div>
            )}
          </div>

          <div className="mt-8 mb-6 border-t pt-6 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Publishing Options</h3>

            <ToggleSwitch
              isOn={isPublished}
              handleToggle={handlePublishToggle}
              label="Publish Status"
              onLabel="Published"
              offLabel="Draft"
            />

            {isPublished && (
              <>
                <ToggleSwitch
                  isOn={isScheduled}
                  handleToggle={handleScheduleToggle}
                  label="Schedule Publication"
                  onLabel="Scheduled"
                  offLabel="Publish Now"
                />

                {isScheduled && (
                  <div className="ml-6 mt-2 mb-4">
                    <InputField
                      label="Schedule Date and Time"
                      name="scheduledDate"
                      value={formData.scheduledDate || ""}
                      onChange={handleChange}
                      type="datetime-local"
                      required={isScheduled}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              {formData.status === "publish"
                ? "Publish Article"
                : formData.status === "scheduled"
                ? "Schedule Article"
                : "Save as Draft"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ArticleForm;