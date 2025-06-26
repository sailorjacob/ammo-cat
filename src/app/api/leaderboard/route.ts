import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/leaderboard - Fetch top 10 scores
export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/leaderboard - Submit a new score
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { player_name, score } = body

    if (!player_name || score === undefined) {
      return NextResponse.json(
        { error: 'Missing player_name or score' },
        { status: 400 }
      )
    }

    // Get current session if available
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null

    // Insert the new score
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([
        {
          player_name: player_name.trim(),
          score: score,
          user_id: userId || null
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error inserting score:', error)
      return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 