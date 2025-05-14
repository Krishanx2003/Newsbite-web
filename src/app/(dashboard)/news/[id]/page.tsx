import { createClient } from '@/lib/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

// Type for news article
type News = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
  is_published: boolean;
  author_id: string;
};

interface Props {
  params: { id: string };
}

export default async function NewsDetailPage({ params }: Props) {
  const supabase = await createClient();
  const { data: news, error: newsError } = await supabase
    .from('news')
    .select('id, title, content, category, created_at, updated_at, published_at, is_published, author_id')
    .eq('id', params.id)
    .eq('is_published', true)
    .single();

  if (newsError || !news) {
    notFound();
  }

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(news.content);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="prose dark:prose-invert max-w-none">
        <h1>{news.title}</h1>
        <p className="text-gray-500">
          Category: {news.category || 'Uncategorized'} | Published:{' '}
          {new Date(news.published_at || news.created_at).toLocaleDateString()}
        </p>
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      </article>
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/news">Back to News</Link>
        </Button>
      </div>
    </main>
  );
}