import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { question, category, expires_at, is_active, show_results_before_voting, target_audience, attached_news_id } = await request.json();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pollData = {
    question,
    category: category || null,
    expires_at: expires_at || null,
    is_active: is_active !== undefined ? is_active : true,
    show_results_before_voting: show_results_before_voting || false,
    target_audience: target_audience || null,
    attached_news_id: attached_news_id || null,
    total_votes: 0,
  };

  const { data: poll, error } = await supabase
    .from('polls')
    .insert(pollData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(poll);
}

export async function GET() {
  const supabase = await createClient();

  const { data: polls, error } = await supabase
    .from('polls')
    .select('id, question, category, created_at, expires_at, is_active, show_results_before_voting, target_audience, attached_news_id, total_votes')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(polls);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { id, question, category, expires_at, is_active, show_results_before_voting, target_audience, attached_news_id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Poll ID is required' }, { status: 400 });
  }

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pollData = {
    question,
    category: category || null,
    expires_at: expires_at || null,
    is_active: is_active !== undefined ? is_active : true,
    show_results_before_voting: show_results_before_voting || false,
    target_audience: target_audience || null,
    attached_news_id: attached_news_id || null,
  };

  const { data: poll, error } = await supabase
    .from('polls')
    .update(pollData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(poll);
}