import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/leaderboard - Fetch top 10 scores
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/leaderboard - Add new score
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { player_name, score } = await request.json();

    if (!player_name || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('leaderboard')
      .insert({ player_name, score })
      .select()
      .single();

    if (error) {
      console.error('Error adding score:', error);
      return NextResponse.json({ error: 'Failed to add score' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 