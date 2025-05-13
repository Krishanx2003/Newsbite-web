import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { title, content, category, is_published, published_at } = await request.json();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const newsData = {
    title,
    content,
    category: category || null,
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
    .select('id, title, content, category, created_at, updated_at, published_at, is_published, author_id')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(news);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { id, title, content, category, is_published, published_at } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
  }

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const newsData = {
    title,
    content,
    category: category || null,
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