import { createServerSupabaseClient } from '../../../../lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    return NextResponse.json({ error: 'Failed to sign in anonymously' }, { status: 500 });
  }

  const { session } = data;
  if (!session) {
    return NextResponse.json({ error: 'No session created' }, { status: 500 });
  }

  return NextResponse.json({ user: session.user });
} 