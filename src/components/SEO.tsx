'use client';

import { usePathname } from 'next/navigation';
import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  canonicalUrl?: string;
}

const defaultSEO = {
  title: 'NewsBite - Latest News and Updates',
  description: 'Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.',
  keywords: 'news, latest news, breaking news, current events, world news',
  ogImage: '/og-default.jpg',
  ogType: 'website' as const,
};

export default function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogType,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  canonicalUrl,
}: SEOProps) {
  const pathname = usePathname();
  const currentUrl = `https://newsbite.in${pathname}`;
  
  const seo = {
    title: title ? `${title} | NewsBite` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    ogImage: ogImage || defaultSEO.ogImage,
    ogType: ogType || defaultSEO.ogType,
    canonicalUrl: canonicalUrl || currentUrl,
  };

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={seo.canonicalUrl} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:site_name" content="NewsBite" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@newsbite_in" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.ogImage} />

      {/* Article Specific Meta Tags */}
      {seo.ogType === 'article' && (
        <>
          {articlePublishedTime && (
            <meta property="article:published_time" content={articlePublishedTime} />
          )}
          {articleModifiedTime && (
            <meta property="article:modified_time" content={articleModifiedTime} />
          )}
          {articleAuthor && (
            <meta property="article:author" content={articleAuthor} />
          )}
        </>
      )}
    </>
  );
} 