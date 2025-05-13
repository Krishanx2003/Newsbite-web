import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();

  if (!user || (await (await supabase).from('profiles').select('role').eq('id', user.id).single()).data?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await request.json();

  const { error } = await (await supabase)
    .from('categories')
    .update({ name })
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}