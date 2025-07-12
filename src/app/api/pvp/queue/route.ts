import { createServerSupabaseClient } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Use service role for admin operations
  const supabaseAdmin = supabase; // Assume service role is set if needed, or adjust

  // Check if user is already in queue
  const { data: existingQueue, error: queueError } = await supabaseAdmin
    .from('pvp_queue')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'queued')
    .single();

  if (queueError && queueError.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Error checking queue' }, { status: 500 });
  }

  if (existingQueue) {
    return NextResponse.json({ message: 'Already in queue', queueId: existingQueue.id });
  }

  // Add to queue
  const { data: queueEntry, error: insertError } = await supabaseAdmin
    .from('pvp_queue')
    .insert({ user_id: user.id })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: 'Error joining queue' }, { status: 500 });
  }

  // Find match
  const { data: queuedUsers, error: findError } = await supabaseAdmin
    .from('pvp_queue')
    .select('*')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(2);

  if (findError) {
    return NextResponse.json({ error: 'Error finding match' }, { status: 500 });
  }

  if (queuedUsers.length < 2) {
    return NextResponse.json({ message: 'Queued', queueId: queueEntry.id });
  }

  // Create match
  const [player1, player2] = queuedUsers;
  const { data: match, error: matchError } = await supabaseAdmin
    .from('pvp_matches')
    .insert({
      player1_id: player1.user_id,
      player2_id: player2.user_id
    })
    .select()
    .single();

  if (matchError) {
    return NextResponse.json({ error: 'Error creating match' }, { status: 500 });
  }

  // Update queues
  await supabaseAdmin
    .from('pvp_queue')
    .update({ status: 'matched', match_id: match.id })
    .in('id', [player1.id, player2.id]);

  return NextResponse.json({ message: 'Matched', match });
}

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const supabaseAdmin = supabase; // Use the same supabase instance for admin operations

  const { data: queueEntry, error } = await supabaseAdmin
    .from('pvp_queue')
    .select('*, pvp_matches(*)')
    .eq('user_id', user.id)
    .eq('status', 'matched')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Error checking queue status' }, { status: 500 });
  }

  if (!queueEntry) {
    return NextResponse.json({ status: 'queued' });
  }

  return NextResponse.json({ status: 'matched', match: queueEntry.pvp_matches });
}

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const supabaseAdmin = supabase; // Use the same supabase instance for admin operations

  const { error } = await supabaseAdmin
    .from('pvp_queue')
    .delete()
    .eq('user_id', user.id)
    .eq('status', 'queued');

  if (error) {
    return NextResponse.json({ error: 'Error leaving queue' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Left queue' });
} 