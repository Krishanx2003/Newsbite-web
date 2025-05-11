
// src/app/api/profile/route.ts

import { createClient } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, updated_at')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!profile) {
    // Return a default profile structure for new users
    return NextResponse.json(
      {
        id: user.id,
        display_name: null,
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: null,
        is_new: true,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ ...profile, is_new: false }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { display_name } = body;

  if (typeof display_name !== 'string' || display_name.trim() === '') {
    return NextResponse.json({ error: 'Display name must be a non-empty string' }, { status: 400 });
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        display_name: display_name.trim(),
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Profile created/updated successfully' }, { status: 200 });
}
