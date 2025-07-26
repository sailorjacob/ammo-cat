import { createServerSupabaseClient } from '../../../../lib/supabase-server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create service role client for admin operations
const getServiceSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

// POST: Join queue and attempt to find match
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('=== QUEUE JOIN START ===');
    console.log('User ID:', user.id);
    console.log('User metadata:', user.user_metadata);

    // STEP 1: Clean up any existing entries for this user (using regular client - RLS allows this)
    const { data: deletedEntries, error: deleteError } = await supabase
      .from('pvp_queue')
      .delete()
      .eq('user_id', user.id)
      .select();

    if (deleteError) {
      console.error('Delete error:', deleteError);
    } else {
      console.log('Deleted old entries:', deletedEntries?.length || 0);
    }

    // STEP 2: Add current user to queue (using regular client - RLS allows this)
    const { data: newEntry, error: insertError } = await supabase
      .from('pvp_queue')
      .insert({ user_id: user.id, status: 'queued' })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to join queue' }, { status: 500 });
    }

    console.log('Created queue entry:', newEntry.id);

    // STEP 3: Wait a moment for database consistency, then find all queued users
    // Using SERVICE ROLE to bypass RLS and see ALL users
    await new Promise(resolve => setTimeout(resolve, 100));

    const serviceSupabase = getServiceSupabase();
    const { data: allQueuedUsers, error: findError } = await serviceSupabase
      .from('pvp_queue')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true });

    if (findError) {
      console.error('Find error:', findError);
      return NextResponse.json({ error: 'Failed to find matches' }, { status: 500 });
    }

    console.log('All queued users found:', allQueuedUsers.length);
    console.log('Queued users:', allQueuedUsers.map(u => ({ id: u.id, user_id: u.user_id, created_at: u.created_at })));

    // STEP 4: If we have 2+ users, create a match
    if (allQueuedUsers.length >= 2) {
      const [player1Entry, player2Entry] = allQueuedUsers.slice(0, 2);
      
      console.log('Creating match between:', player1Entry.user_id, 'and', player2Entry.user_id);

      // Create the match (using service role)
      const { data: match, error: matchError } = await serviceSupabase
        .from('pvp_matches')
        .insert({
          player1_id: player1Entry.user_id,
          player2_id: player2Entry.user_id,
          status: 'active'
        })
        .select()
        .single();

      if (matchError) {
        console.error('Match creation error:', matchError);
        return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
      }

      console.log('Match created:', match.id);

      // Update both queue entries to matched status (using service role)
      const { error: updateError } = await serviceSupabase
        .from('pvp_queue')
        .update({ status: 'matched', match_id: match.id })
        .in('id', [player1Entry.id, player2Entry.id]);

      if (updateError) {
        console.error('Update queue error:', updateError);
        // Don't fail the request, the match is created
      }

      console.log('=== MATCH CREATED SUCCESSFULLY ===');
      return NextResponse.json({ message: 'Matched', match });
    }

    // STEP 5: Not enough users, return queued status
    console.log('Not enough users for match, staying in queue');
    console.log('=== QUEUE JOIN END ===');
    return NextResponse.json({ message: 'Queued', queueId: newEntry.id });

  } catch (error) {
    console.error('Unexpected error in POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Check current user's queue status
export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: queueEntry, error } = await supabase
      .from('pvp_queue')
      .select('*, pvp_matches(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log('GET: User not in queue');
      return NextResponse.json({ status: 'not_queued' });
    }

    if (queueEntry.status === 'matched' && queueEntry.match_id) {
      console.log('GET: User matched');
      return NextResponse.json({ 
        status: 'matched', 
        match: queueEntry.pvp_matches 
      });
    }

    console.log('GET: User not matched, returning queued status');
    return NextResponse.json({ status: 'queued' });
  } catch (error) {
    console.error('Unexpected error in GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Leave queue
export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await supabase
      .from('pvp_queue')
      .delete()
      .eq('user_id', user.id);

    return NextResponse.json({ message: 'Left queue' });
  } catch (error) {
    console.error('Unexpected error in DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// OPTIONS: Debug endpoint to see all queue entries
export async function OPTIONS(request: Request) {
  try {
    // Use service role to see ALL entries for debugging
    const serviceSupabase = getServiceSupabase();

    const { data: allEntries, error } = await serviceSupabase
      .from('pvp_queue')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('OPTIONS Debug error:', error);
      return NextResponse.json({ error: 'Error checking queue' }, { status: 500 });
    }

    console.log('=== DEBUG: ALL QUEUE ENTRIES ===');
    console.log('Total entries:', allEntries.length);
    allEntries.forEach(entry => {
      console.log(`Entry ${entry.id}: user=${entry.user_id}, status=${entry.status}, created=${entry.created_at}`);
    });
    console.log('=== END DEBUG ===');
    
    return NextResponse.json({ 
      message: 'Debug: All queue entries', 
      totalEntries: allEntries.length,
      entries: allEntries
    });
  } catch (error) {
    console.error('Unexpected error in OPTIONS:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 