"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/client";
import Link from "next/link";
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

interface RelatedArticle {
  id: string;
  title: string;
  image_url: string;
}

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data: articleData, error: articleError } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (articleError) {
          toast.error("Article not found");
          console.error(articleError);
          return;
        }

        setArticle(articleData);

        // Fetch related articles
        const { data: relatedData, error: relatedError } = await supabase
          .from("articles")
          .select("id, title, image_url")
          .neq("id", id)
          .contains("tags", articleData.tags)
          .limit(3);

        if (relatedError) {
          toast.error("Failed to fetch related articles");
          console.error(relatedError);
          return;
        }

        setRelatedArticles(relatedData || []);
      } catch (error) {
        toast.error("Network error: Please try again later");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, supabase]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!article) {
    return <div className="text-center py-8">Article not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-96 object-cover rounded-lg"
        />
        <h1 className="text-4xl font-bold mt-8 text-blue-700 dark:text-blue-300">{article.title}</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mt-4">{article.subtitle}</p>
        <div className="flex items-center mt-6">
          <img
            src={article.author_avatar}
            alt={article.author_name}
            className="w-12 h-12 rounded-full"
          />
          <span className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
            {article.author_name}
          </span>
        </div>
        <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
          Published on {new Date(article.date).toLocaleDateString()} · {article.read_time}
        </p>
        <div
          className="prose dark:prose-invert mt-10 prose-lg max-w-none"
          style={{ color: '#333', fontSize: '1.15rem', lineHeight: '1.7' }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <h2 className="text-3xl font-bold mt-12 mb-6 text-green-700 dark:text-green-300">Related Reads</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedArticles.map((related) => (
            <Link key={related.id} href={`/articles/${related.id}`}>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src={related.image_url}
                  alt={related.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h3 className="text-xl font-semibold mt-4 text-indigo-600 dark:text-indigo-400">{related.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;