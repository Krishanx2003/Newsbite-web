// src/app/api/categories/route.ts
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

export async function GET() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(categories);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { id, name } = await request.json();

  if (!id || !name) {
    return NextResponse.json({ error: 'Category ID and name are required' }, { status: 400 });
  }

  const { data: category, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(category);
}