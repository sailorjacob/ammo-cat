import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../../lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const { matchId } = params;
    const body = await request.json();
    const { winner_id } = body;

    if (!winner_id) {
      return NextResponse.json({ error: 'winner_id is required' }, { status: 400 });
    }

    const supabase = createClient();

    // Update the match with the winner
    const { error } = await supabase
      .from('pvp_matches')
      .update({ 
        winner_id,
        status: 'completed',
        ended_at: new Date().toISOString()
      })
      .eq('id', matchId);

    if (error) {
      console.error('Error updating match:', error);
      return NextResponse.json({ error: 'Failed to update match' }, { status: 500 });
    }

    // Update player stats
    const { data: match } = await supabase
      .from('pvp_matches')
      .select('player1_id, player2_id')
      .eq('id', matchId)
      .single();

    if (match) {
      // Get current stats for winner
      const { data: winnerStats } = await supabase
        .from('pvp_stats')
        .select('wins, games')
        .eq('user_id', winner_id)
        .single();

      const winnerWins = (winnerStats?.wins || 0) + 1;
      const winnerGames = (winnerStats?.games || 0) + 1;

      // Update winner stats
      await supabase
        .from('pvp_stats')
        .upsert({
          user_id: winner_id,
          wins: winnerWins,
          games: winnerGames
        }, {
          onConflict: 'user_id'
        });

      // Get current stats for loser
      const loser_id = winner_id === match.player1_id ? match.player2_id : match.player1_id;
      const { data: loserStats } = await supabase
        .from('pvp_stats')
        .select('wins, games')
        .eq('user_id', loser_id)
        .single();

      const loserWins = loserStats?.wins || 0;
      const loserGames = (loserStats?.games || 0) + 1;

      // Update loser stats
      await supabase
        .from('pvp_stats')
        .upsert({
          user_id: loser_id,
          wins: loserWins,
          games: loserGames
        }, {
          onConflict: 'user_id'
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Match update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 