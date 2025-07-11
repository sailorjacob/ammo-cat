import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '../../../../../lib/supabase';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const { winner_id } = body;

  if (!winner_id) {
    return NextResponse.json({ error: 'Missing winner_id' }, { status: 400 });
  }

  // Auth check
  const cookieStore = cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;
  const refreshToken = cookieStore.get('sb-refresh-token')?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Admin client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  // Verify user is in the match
  const { data: match, error: matchError } = await supabaseAdmin
    .from('pvp_matches')
    .select('*')
    .eq('id', id)
    .single();

  if (matchError || !match || (match.player1_id !== user.id && match.player2_id !== user.id)) {
    return NextResponse.json({ error: 'Unauthorized or match not found' }, { status: 403 });
  }

  // Update winner
  const { data: updatedMatch, error: updateError } = await supabaseAdmin
    .from('pvp_matches')
    .update({ winner_id, status: 'completed' })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: 'Error updating match' }, { status: 500 });
  }

  // Update stats for both players if logged-in
  const players = [updatedMatch.player1_id, updatedMatch.player2_id];
  for (const playerId of players) {
    if (!playerId) continue;

    // Check if user exists and not anon (simplified; assume all in matches are valid)
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(playerId);
    if (userData?.user && !userData.user.is_anonymous) {
      const isWinner = playerId === winner_id;
      // Fetch current stats
      const { data: currentStats } = await supabaseAdmin
        .from('pvp_stats')
        .select('*')
        .eq('user_id', playerId)
        .single();

      const games = (currentStats?.games_played || 0) + 1;
      const wins = (currentStats?.wins || 0) + (isWinner ? 1 : 0);
      const losses = (currentStats?.losses || 0) + (isWinner ? 0 : 1);

      await supabaseAdmin
        .from('pvp_stats')
        .upsert({
          user_id: playerId,
          games_played: games,
          wins: wins,
          losses: losses,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    }
  }

  return NextResponse.json({ message: 'Match updated' });
} 