import { createServerSupabaseClient } from '../../../../lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createServerSupabaseClient();

  // Create a unique email for this browser session
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const uniqueEmail = `anonymous-${uniqueId}@ammo-cat.local`;
  
  console.log('Creating anonymous user with email:', uniqueEmail);
  
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
    console.error('Anonymous sign-up error:', error);
    return NextResponse.json({ error: 'Failed to sign in anonymously' }, { status: 500 });
  }

  const { session } = data;
  if (!session) {
    console.error('No session created for anonymous user');
    return NextResponse.json({ error: 'No session created' }, { status: 500 });
  }

  console.log('Anonymous user created successfully:', session.user.id);
  return NextResponse.json({ user: session.user });
} 