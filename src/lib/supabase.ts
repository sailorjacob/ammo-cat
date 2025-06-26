import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type for our leaderboard entries
export type LeaderboardEntry = {
  id?: string
  player_name: string
  score: number
  created_at?: string
  user_id?: string
} 