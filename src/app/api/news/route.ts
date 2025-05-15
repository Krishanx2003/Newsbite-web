import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Parse form data for file upload or image URL
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const is_published = formData.get('is_published') === 'true';
  const published_at = formData.get('published_at') as string;
  const image_url = formData.get('image_url') as string; // For manual URL input
  const image_file = formData.get('image_file') as File; // For file upload

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let finalImageUrl = image_url;

  // Handle file upload to Supabase Storage if a file is provided
  if (image_file && image_file.size > 0) {
    const fileName = `${user.id}/${Date.now()}-${image_file.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from('news-images') // Ensure this bucket exists in Supabase
      .upload(fileName, image_file, {
        contentType: image_file.type,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('news-images')
      .getPublicUrl(fileName);

    finalImageUrl = publicUrlData.publicUrl;
  }

  const newsData = {
    title,
    content,
    category: category || null,
    image_url: finalImageUrl || null, // Store the image URL (from file or input)
    author_id: user.id,
    is_published: is_published || false,
    published_at: is_published && published_at ? published_at : null,
  };

  const { data: news, error } = await supabase
    .from('news')
    .insert(newsData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(news);
}

export async function GET() {
  const supabase = await createClient();

  const { data: news, error } = await supabase
    .from('news')
    .select('id, title, content, category, image_url, created_at, updated_at, published_at, is_published, author_id')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(news);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  
  // Parse form data for file upload or image URL
  const formData = await request.formData();
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const is_published = formData.get('is_published') === 'true';
  const published_at = formData.get('published_at') as string;
  const image_url = formData.get('image_url') as string;
  const image_file = formData.get('image_file') as File;

  if (!id) {
    return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
  }

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let finalImageUrl = image_url;

  // Handle file upload to Supabase Storage if a file is provided
  if (image_file && image_file.size > 0) {
    const fileName = `${user.id}/${Date.now()}-${image_file.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(fileName, image_file, {
        contentType: image_file.type,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('news-images')
      .getPublicUrl(fileName);

    finalImageUrl = publicUrlData.publicUrl;
  }

  const newsData = {
    title,
    content,
    category: category || null,
    image_url: finalImageUrl || null,
    is_published: is_published || false,
    published_at: is_published && published_at ? published_at : null,
  };

  const { data: news, error } = await supabase
    .from('news')
    .update(newsData)
    .eq('id', id)
    .eq('author_id', user.id) // Ensure only the author can update
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(news);
}