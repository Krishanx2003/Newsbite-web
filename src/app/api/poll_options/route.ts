import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { poll_id, text } = await request.json();

    if (!poll_id || !text) {
      return NextResponse.json({ error: 'poll_id and text are required' }, { status: 400 });
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: User not authenticated' }, { status: 401 });
    }

    // Verify user is the poll creator
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('attached_news_id')
      .eq('id', poll_id)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: pollError?.message || 'Poll not found' }, { status: 404 });
    }

    if (poll.attached_news_id) {
      const { data: news, error: newsError } = await supabase
        .from('news')
        .select('author_id')
        .eq('id', poll.attached_news_id)
        .single();

      if (newsError || !news) {
        return NextResponse.json({ error: newsError?.message || 'News article not found' }, { status: 404 });
      }
      if (news.author_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized: User does not own this poll' }, { status: 403 });
      }
    }

    const optionData = {
      poll_id,
      text,
      votes: 0,
    };

    const { data: option, error } = await supabase
      .from('poll_options')
      .insert(optionData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message || 'Failed to create poll option' }, { status: 500 });
    }

    return NextResponse.json(option);
  } catch (err) {
    console.error('Unexpected error in POST /api/poll_options:', err);
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

    const { data: options, error } = await supabase
      .from('poll_options')
      .select('id, poll_id, text, votes')
      .eq('poll_id', poll_id)
      .order('text', { ascending: true });

    if (error) {
      console.error('Supabase select error:', error);
      return NextResponse.json({ error: error.message || 'Failed to fetch poll options' }, { status: 500 });
    }

    return NextResponse.json(options || []);
  } catch (err) {
    console.error('Unexpected error in GET /api/poll_options:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { id, text } = await request.json();

    if (!id || !text) {
      return NextResponse.json({ error: 'Option ID and text are required' }, { status: 400 });
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: User not authenticated' }, { status: 401 });
    }

    // Verify user is the poll creator
    const { data: option, error: optionError } = await supabase
      .from('poll_options')
      .select('poll_id')
      .eq('id', id)
      .single();

    if (optionError || !option) {
      return NextResponse.json({ error: optionError?.message || 'Option not found' }, { status: 404 });
    }

    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('attached_news_id')
      .eq('id', option.poll_id)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: pollError?.message || 'Poll not found' }, { status: 404 });
    }

    if (poll.attached_news_id) {
      const { data: news, error: newsError } = await supabase
        .from('news')
        .select('author_id')
        .eq('id', poll.attached_news_id)
        .single();

      if (newsError || !news) {
        return NextResponse.json({ error: newsError?.message || 'News article not found' }, { status: 404 });
      }
      if (news.author_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized: User does not own this poll' }, { status: 403 });
      }
    }

    const { data: updatedOption, error } = await supabase
      .from('poll_options')
      .update({ text })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message || 'Failed to update poll option' }, { status: 500 });
    }

    return NextResponse.json(updatedOption);
  } catch (err) {
    console.error('Unexpected error in PATCH /api/poll_options:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}