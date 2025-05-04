"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Article {
  id: string;
  title: string;
  subtitle: string;
  author_name: string;
  author_avatar: string;
  date: string;
  read_time: string;
  category: string;
  content: string;
  tags: string[];
  image_url: string;
}

const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Fetch all articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/article");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        toast.error("Error fetching articles");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Handle delete article
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/article?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      // Remove the deleted article from the list
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== id)
      );

      toast.success("Article deleted successfully");
    } catch (error) {
      toast.error("Error deleting article");
      console.error(error);
    }
  };

  // Handle edit article
  const handleEdit = (id: string) => {
    router.push(`/admin/articles/articlesform/${id}`);
  };

  // Handle create new article
  const handleCreate = () => {
    router.push("/admin/articles/articlesform");
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <ToastContainer />
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Manage Articles</h1>

        <button
          onClick={handleCreate}
          className="mb-6 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
        >
          Create New Article
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Title
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Author
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 dark:border-gray-600 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                    {article.title}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                    {article.author_name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300">
                    {new Date(article.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300 dark:border-gray-600 text-sm">
                    <button
                      onClick={() => handleEdit(article.id)}
                      className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminArticlesPage;