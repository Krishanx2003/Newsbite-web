import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();

  if (!user || (await (await supabase).from('profiles').select('role').eq('id', user.id).single()).data?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, category_id, is_published, published_at } = await request.json();

  const { data: news, error } = await (await supabase)
    .from('news')
    .insert({
      title,
      content,
      category_id: category_id || null,
      is_published,
      published_at: is_published ? (published_at || new Date().toISOString()) : null,
      author_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(news);
}