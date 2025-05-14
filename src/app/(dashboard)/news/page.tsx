import { createClient } from '@/lib/server';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  published_at?: string;
  is_published: boolean;
  author_id: string;
}

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: news, error } = await supabase
    .from('news')
    .select('id, title, content, category, created_at, published_at, is_published')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading news: {error.message}</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest News</h1>
      {news && news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="block bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {article.content.replace(/<[^>]+>/g, '')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {article.category} • {new Date(article.published_at || article.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No news articles found.</p>
      )}
      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}