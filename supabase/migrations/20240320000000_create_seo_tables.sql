-- Create enum for og_type
CREATE TYPE og_type AS ENUM ('website', 'article');

-- Create seo_metadata table
CREATE TABLE seo_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL,
    title TEXT,
    description TEXT,
    keywords TEXT,
    og_image TEXT,
    og_type og_type DEFAULT 'website',
    article_published_time TIMESTAMPTZ,
    article_modified_time TIMESTAMPTZ,
    article_author TEXT,
    canonical_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    UNIQUE(page_path)
);

-- Create index for faster lookups
CREATE INDEX idx_seo_metadata_page_path ON seo_metadata(page_path);

-- Enable Row Level Security
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_seo_metadata_updated_at
    BEFORE UPDATE ON seo_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies

-- Allow public read access to all SEO metadata
CREATE POLICY "Allow public read access to SEO metadata"
    ON seo_metadata
    FOR SELECT
    TO public
    USING (true);

-- Allow authenticated users to insert SEO metadata
CREATE POLICY "Allow authenticated users to insert SEO metadata"
    ON seo_metadata
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Allow authenticated users to update their own SEO metadata
CREATE POLICY "Allow authenticated users to update their own SEO metadata"
    ON seo_metadata
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = updated_by);

-- Allow authenticated users to delete their own SEO metadata
CREATE POLICY "Allow authenticated users to delete their own SEO metadata"
    ON seo_metadata
    FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- Create function to get SEO metadata by path
CREATE OR REPLACE FUNCTION get_seo_metadata_by_path(path TEXT)
RETURNS TABLE (
    id UUID,
    page_path TEXT,
    title TEXT,
    description TEXT,
    keywords TEXT,
    og_image TEXT,
    og_type og_type,
    article_published_time TIMESTAMPTZ,
    article_modified_time TIMESTAMPTZ,
    article_author TEXT,
    canonical_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sm.id,
        sm.page_path,
        sm.title,
        sm.description,
        sm.keywords,
        sm.og_image,
        sm.og_type,
        sm.article_published_time,
        sm.article_modified_time,
        sm.article_author,
        sm.canonical_url
    FROM seo_metadata sm
    WHERE sm.page_path = path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to upsert SEO metadata
CREATE OR REPLACE FUNCTION upsert_seo_metadata(
    p_page_path TEXT,
    p_title TEXT,
    p_description TEXT,
    p_keywords TEXT,
    p_og_image TEXT,
    p_og_type og_type,
    p_article_published_time TIMESTAMPTZ,
    p_article_modified_time TIMESTAMPTZ,
    p_article_author TEXT,
    p_canonical_url TEXT
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO seo_metadata (
        page_path,
        title,
        description,
        keywords,
        og_image,
        og_type,
        article_published_time,
        article_modified_time,
        article_author,
        canonical_url,
        created_by,
        updated_by
    )
    VALUES (
        p_page_path,
        p_title,
        p_description,
        p_keywords,
        p_og_image,
        p_og_type,
        p_article_published_time,
        p_article_modified_time,
        p_article_author,
        p_canonical_url,
        auth.uid(),
        auth.uid()
    )
    ON CONFLICT (page_path) DO UPDATE
    SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        keywords = EXCLUDED.keywords,
        og_image = EXCLUDED.og_image,
        og_type = EXCLUDED.og_type,
        article_published_time = EXCLUDED.article_published_time,
        article_modified_time = EXCLUDED.article_modified_time,
        article_author = EXCLUDED.article_author,
        canonical_url = EXCLUDED.canonical_url,
        updated_at = NOW(),
        updated_by = auth.uid()
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 