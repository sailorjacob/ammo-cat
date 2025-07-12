import { createServerSupabaseClient } from '../../../../lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('User authenticated:', user.id);

    // Clean up any existing queue entries for this user (old or stuck entries)
    await supabase
      .from('pvp_queue')
      .delete()
      .eq('user_id', user.id);

    // Add to queue
    const { data: queueEntry, error: insertError } = await supabase
      .from('pvp_queue')
      .insert({ user_id: user.id })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Error joining queue' }, { status: 500 });
    }

    // Find match
    const { data: queuedUsers, error: findError } = await supabase
      .from('pvp_queue')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(2);

    if (findError) {
      console.error('Find match error:', findError);
      return NextResponse.json({ error: 'Error finding match' }, { status: 500 });
    }

    if (queuedUsers.length < 2) {
      return NextResponse.json({ message: 'Queued', queueId: queueEntry.id });
    }

    // Create match
    const [player1, player2] = queuedUsers;
    const { data: match, error: matchError } = await supabase
      .from('pvp_matches')
      .insert({
        player1_id: player1.user_id,
        player2_id: player2.user_id
      })
      .select()
      .single();

    if (matchError) {
      console.error('Match creation error:', matchError);
      return NextResponse.json({ error: 'Error creating match' }, { status: 500 });
    }

    // Update queues
    await supabase
      .from('pvp_queue')
      .update({ status: 'matched', match_id: match.id })
      .in('id', [player1.id, player2.id]);

    return NextResponse.json({ message: 'Matched', match });
  } catch (error) {
    console.error('Unexpected error in POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error in GET:', userError);
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // First check if user is in queue
    const { data: queueEntry, error: queueError } = await supabase
      .from('pvp_queue')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'matched')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (queueError && queueError.code !== 'PGRST116') {
      console.error('Queue status check error:', queueError);
      return NextResponse.json({ error: 'Error checking queue status' }, { status: 500 });
    }

    if (!queueEntry) {
      return NextResponse.json({ status: 'queued' });
    }

    // If user is matched, get the match details separately
    const { data: match, error: matchError } = await supabase
      .from('pvp_matches')
      .select('*')
      .eq('id', queueEntry.match_id)
      .single();

    if (matchError) {
      console.error('Match fetch error:', matchError);
      return NextResponse.json({ error: 'Error fetching match' }, { status: 500 });
    }

    return NextResponse.json({ status: 'matched', match });
  } catch (error) {
    console.error('Unexpected error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error in DELETE:', userError);
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { error } = await supabase
      .from('pvp_queue')
      .delete()
      .eq('user_id', user.id)
      .eq('status', 'queued');

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Error leaving queue' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Left queue' });
  } catch (error) {
    console.error('Unexpected error in DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 