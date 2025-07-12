import { createServerSupabaseClient } from '../../../../lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createServerSupabaseClient();

  // Create a unique email for this browser session
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const uniqueEmail = `anonymous-${uniqueId}@ammo-cat.local`;
  
  const { data, error } = await supabase.auth.signUp({
    email: uniqueEmail,
    password: uniqueId, // Use the same unique ID as password
    options: {
      data: {
        is_anonymous: true
      }
    }
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to sign in anonymously' }, { status: 500 });
  }

  const { session } = data;
  if (!session) {
    return NextResponse.json({ error: 'No session created' }, { status: 500 });
  }

  return NextResponse.json({ user: session.user });
} 