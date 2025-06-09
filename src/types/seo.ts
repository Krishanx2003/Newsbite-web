export type OgType = 'website' | 'article';

export interface SEOMetadata {
  id: string;
  page_path: string;
  title?: string;
  description?: string;
  keywords?: string;
  og_image?: string;
  og_type?: OgType;
  article_published_time?: string;
  article_modified_time?: string;
  article_author?: string;
  canonical_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface SEOMetadataInput {
  page_path: string;
  title?: string;
  description?: string;
  keywords?: string;
  og_image?: string;
  og_type?: OgType;
  article_published_time?: string;
  article_modified_time?: string;
  article_author?: string;
  canonical_url?: string;
} 