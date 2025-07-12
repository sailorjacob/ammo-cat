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

    console.log('Added user to queue:', queueEntry.id);

    // Find match - get ALL queued users, not just limit 2
    const { data: queuedUsers, error: findError } = await supabase
      .from('pvp_queue')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true });

    if (findError) {
      console.error('Find match error:', findError);
      return NextResponse.json({ error: 'Error finding match' }, { status: 500 });
    }

    console.log('Total queued users:', queuedUsers.length);
    console.log('Queued users:', queuedUsers.map(u => ({ id: u.id, user_id: u.user_id, created_at: u.created_at })));

    if (queuedUsers.length < 2) {
      console.log('Not enough users for match, returning queued status');
      return NextResponse.json({ message: 'Queued', queueId: queueEntry.id });
    }

    // Take the first 2 users for the match
    const [player1, player2] = queuedUsers.slice(0, 2);
    console.log('Creating match between:', player1.user_id, 'and', player2.user_id);

    // Create match
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

    console.log('Match created:', match.id);

    // Update queues
    const { error: updateError } = await supabase
      .from('pvp_queue')
      .update({ status: 'matched', match_id: match.id })
      .in('id', [player1.id, player2.id]);

    if (updateError) {
      console.error('Queue update error:', updateError);
      return NextResponse.json({ error: 'Error updating queue' }, { status: 500 });
    }

    console.log('Queues updated to matched status');

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

    console.log('GET: Checking queue status for user:', user.id);

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
      console.log('GET: User not matched, returning queued status');
      return NextResponse.json({ status: 'queued' });
    }

    console.log('GET: User is matched, queue entry:', queueEntry.id);

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

    console.log('GET: Returning matched status with match:', match.id);
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

// Debug endpoint to check queue status
export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all queued users for debugging
    const { data: queuedUsers, error } = await supabase
      .from('pvp_queue')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Debug queue check error:', error);
      return NextResponse.json({ error: 'Error checking queue' }, { status: 500 });
    }

    console.log('DEBUG: Current queued users:', queuedUsers);
    return NextResponse.json({
      message: 'Queue debug info',
      queuedUsers: queuedUsers.map(u => ({
        id: u.id,
        user_id: u.user_id,
        status: u.status,
        created_at: u.created_at
      }))
    });
  } catch (error) {
    console.error('Unexpected error in PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 