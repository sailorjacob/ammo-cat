import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data, error } = await supabaseAdmin
      .from('pvp_stats')
      .select('*')
      .order('wins', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching PVP stats:', error);
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    const leaderboard = [];
    for (const stat of data || []) {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(stat.user_id);
      let name = 'Anonymous';
      if (userData?.user && !userError) {
        name = userData.user.email?.split('@')[0] || 'User' + stat.user_id.substring(0, 4);
      }
      leaderboard.push({
        name,
        wins: stat.wins,
        games: stat.games_played
      });
    }

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 