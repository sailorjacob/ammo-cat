import { createServerSupabaseClient } from '../../../../lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createServerSupabaseClient();

  // Create a unique identifier for this browser session
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('Creating anonymous user with unique ID:', uniqueId);
  
  try {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error('Anonymous sign-in error:', error);
      return NextResponse.json({ error: 'Failed to sign in anonymously' }, { status: 500 });
    }

    const { session } = data;
    if (!session) {
      console.error('No session created for anonymous user');
      return NextResponse.json({ error: 'No session created' }, { status: 500 });
    }

    // Update the user metadata with a unique identifier
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        browser_session_id: uniqueId,
        is_anonymous: true
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      // Don't fail the request, just log the error
    }

    console.log('Anonymous user created successfully:', session.user.id, 'with session ID:', uniqueId);
    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('Unexpected error in anonymous sign-in:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 