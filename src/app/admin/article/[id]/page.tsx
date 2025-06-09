import { Metadata } from 'next';
import { getSEOMetadataByPath } from '@/lib/supabase/seo';
import SEO from '@/components/SEO';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = `/admin/article/${params.id}`;
  const seoData = await getSEOMetadataByPath(path);

  return {
    title: seoData?.title || 'Edit Article | NewsBite Admin',
    description: seoData?.description,
    keywords: seoData?.keywords,
    openGraph: {
      title: seoData?.title,
      description: seoData?.description,
      type: 'article',
      url: `https://newsbite.in${path}`,
      images: seoData?.og_image ? [{ url: seoData.og_image }] : undefined,
      publishedTime: seoData?.article_published_time,
      modifiedTime: seoData?.article_modified_time,
      authors: seoData?.article_author ? [seoData.article_author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData?.title,
      description: seoData?.description,
      images: seoData?.og_image ? [seoData.og_image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const path = `/admin/article/${params.id}`;
  const seoData = await getSEOMetadataByPath(path);

  return (
    <>
      <SEO
        title={seoData?.title}
        description={seoData?.description}
        keywords={seoData?.keywords}
        ogType="article"
        ogImage={seoData?.og_image}
        articlePublishedTime={seoData?.article_published_time}
        articleModifiedTime={seoData?.article_modified_time}
        articleAuthor={seoData?.article_author}
        canonicalUrl={`https://newsbite.in${path}`}
      />
      {/* Article content */}
    </>
  );
} 