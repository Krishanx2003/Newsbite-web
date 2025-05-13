import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { poll_id, option_id, ip_address } = await request.json();

    if (!poll_id || !option_id) {
      return NextResponse.json({ error: 'poll_id and option_id are required' }, { status: 400 });
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
    }

    const voteData = {
      poll_id,
      option_id,
      user_id: user?.id || null,
      ip_address: user ? null : ip_address || null,
    };

    const { data: vote, error } = await supabase
      .from('poll_votes')
      .insert(voteData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message || 'Failed to cast vote' }, { status: 500 });
    }

    return NextResponse.json(vote);
  } catch (err) {
    console.error('Unexpected error in POST /api/poll_votes:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const poll_id = searchParams.get('poll_id');

    if (!poll_id) {
      return NextResponse.json({ error: 'Poll ID is required' }, { status: 400 });
    }

    const { data: votes, error } = await supabase
      .from('poll_votes')
      .select('id, poll_id, option_id, user_id, ip_address, created_at')
      .eq('poll_id', poll_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      return NextResponse.json({ error: error.message || 'Failed to fetch votes' }, { status: 500 });
    }

    return NextResponse.json(votes || []);
  } catch (err) {
    console.error('Unexpected error in GET /api/poll_votes:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}