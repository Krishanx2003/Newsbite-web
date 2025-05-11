// src/app/api/auth/signout/route.ts

import { createClient } from '@/lib/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Redirect to login page after signout
  return NextResponse.redirect(new URL('/login', process.env.SITE_URL), { status: 302 });
}