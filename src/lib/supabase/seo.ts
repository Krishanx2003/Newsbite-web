import { createClient } from '@supabase/supabase-js';
import { SEOMetadata, SEOMetadataInput } from '@/types/seo';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getSEOMetadataByPath(path: string): Promise<SEOMetadata | null> {
  const { data, error } = await supabase
    .rpc('get_seo_metadata_by_path', { path });

  if (error) {
    console.error('Error fetching SEO metadata:', error);
    return null;
  }

  return data?.[0] || null;
}

export async function upsertSEOMetadata(metadata: SEOMetadataInput): Promise<string | null> {
  const { data, error } = await supabase
    .rpc('upsert_seo_metadata', {
      p_page_path: metadata.page_path,
      p_title: metadata.title,
      p_description: metadata.description,
      p_keywords: metadata.keywords,
      p_og_image: metadata.og_image,
      p_og_type: metadata.og_type,
      p_article_published_time: metadata.article_published_time,
      p_article_modified_time: metadata.article_modified_time,
      p_article_author: metadata.article_author,
      p_canonical_url: metadata.canonical_url
    });

  if (error) {
    console.error('Error upserting SEO metadata:', error);
    return null;
  }

  return data;
}

export async function deleteSEOMetadata(path: string): Promise<boolean> {
  const { error } = await supabase
    .from('seo_metadata')
    .delete()
    .eq('page_path', path);

  if (error) {
    console.error('Error deleting SEO metadata:', error);
    return false;
  }

  return true;
} 