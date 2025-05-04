"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { createClient } from "@/lib/client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import InputField from "../components/InputField";
import RichTextEditor from "../components/RichTextEditor";

interface FormData {
  title: string;
  subtitle: string;
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
}

const ArticleForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subtitle: "",
    author: {
      name: "",
      avatar: "",
    },
    date: "",
    readTime: "",
    category: "",
    content: "",
    tags: [],
    imageFile: null,
    imageUrl: "",
  });

  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prevData) => ({
      ...prevData,
      content,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.imageFile) {
        toast.error("Please select an image file");
        return;
      }

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

      const response = await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: publicUrlData.publicUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Error submitting article");
        return;
      }

      toast.success("Article submitted successfully!");
      setTimeout(() => {
        router.push("/admin/article");
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
            <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">{formData.subtitle}</h2>
            
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
            
            {formData.imageFile && (
              <div className="mb-6">
                <img 
                  src={URL.createObjectURL(formData.imageFile)} 
                  alt="Preview" 
                  className="w-full h-auto rounded-lg"
                />
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
            <h2 className="text-2xl font-bold">Create New Article</h2>
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
            onChange={handleChange}
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
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
            />
          </div>

          <InputField
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags.join(", ")}
            onChange={handleTagsChange}
            required
          />

          <InputField
            label="Article Image"
            name="image"
            onChange={handleImageChange}
            type="file"
            accept="image/*"
            required
          />

          <div className="text-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ArticleForm;