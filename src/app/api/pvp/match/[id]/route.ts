import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../lib/supabase-server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { winner_id } = await request.json();

    const { data, error } = await supabase
      .from('pvp_matches')
      .update({ winner_id, ended_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating match:', error);
      return NextResponse.json({ error: 'Failed to update match' }, { status: 500 });
    }

    // Update stats
    const { error: statsError } = await supabase
      .from('pvp_stats')
      .upsert(
        { user_id: winner_id, wins: 1, games_played: 1 },
        { onConflict: 'user_id' }
      );

    if (statsError) {
      console.error('Error updating stats:', statsError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 