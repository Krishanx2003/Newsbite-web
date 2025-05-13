import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { name } = await request.json();

  const { data: category, error } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(category);
}