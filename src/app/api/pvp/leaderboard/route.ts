import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/pvp/leaderboard - Fetch top 10 PVP win records
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('pvp_leaderboard')
      .select('*')
      .order('wins', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching PVP leaderboard:', error);
      return NextResponse.json({ error: 'Failed to fetch PVP leaderboard' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/pvp/leaderboard - Add new win record
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { player_name } = await request.json();

    if (!player_name) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 });
    }

    // Check if player already exists
    const { data: existingPlayer, error: findError } = await supabase
      .from('pvp_leaderboard')
      .select('*')
      .eq('player_name', player_name)
      .single();

    if (findError && findError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new players
      console.error('Error finding player:', findError);
      return NextResponse.json({ error: 'Failed to check existing player' }, { status: 500 });
    }

    let result;
    if (existingPlayer) {
      // Update existing player's win count
      const { data, error } = await supabase
        .from('pvp_leaderboard')
        .update({ wins: existingPlayer.wins + 1 })
        .eq('player_name', player_name)
        .select()
        .single();

      if (error) {
        console.error('Error updating wins:', error);
        return NextResponse.json({ error: 'Failed to update wins' }, { status: 500 });
      }
      result = data;
    } else {
      // Create new player record
      const { data, error } = await supabase
        .from('pvp_leaderboard')
        .insert({ player_name, wins: 1 })
        .select()
        .single();

      if (error) {
        console.error('Error adding new player:', error);
        return NextResponse.json({ error: 'Failed to add new player' }, { status: 500 });
      }
      result = data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 