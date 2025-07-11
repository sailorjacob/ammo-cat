import { supabase } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    return NextResponse.json({ error: 'Failed to sign in anonymously' }, { status: 500 });
  }

  const { session } = data;
  if (!session) {
    return NextResponse.json({ error: 'No session created' }, { status: 500 });
  }

  // Set cookies
  const cookieStore = cookies();
  cookieStore.set('sb-access-token', session.access_token, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  cookieStore.set('sb-refresh-token', session.refresh_token, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  return NextResponse.json({ user: session.user });
} 