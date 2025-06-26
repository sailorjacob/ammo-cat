# Supabase Setup Guide for AMMOCAT Leaderboard

## 1. Environment Variables

Create a `.env.local` file in your project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these values from your Supabase project:
1. Go to your Supabase project dashboard
2. Click on "Settings" > "API"
3. Copy the "Project URL" and "anon public" key

## 2. Database Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Create leaderboard table
CREATE TABLE leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view leaderboard entries
CREATE POLICY "Anyone can view leaderboard" 
ON leaderboard FOR SELECT 
TO public 
USING (true);

-- Policy: Authenticated users can insert their own scores
CREATE POLICY "Users can insert their own scores" 
ON leaderboard FOR INSERT 
TO public 
WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

-- Function to get top 10 scores
CREATE OR REPLACE FUNCTION get_top_scores(limit_count INT DEFAULT 10)
RETURNS TABLE (
  id UUID,
  player_name TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.player_name,
    l.score,
    l.created_at
  FROM leaderboard l
  ORDER BY l.score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

## 3. Enable Anonymous Authentication

In your Supabase dashboard:
1. Go to "Authentication" > "Providers"
2. Enable "Anonymous Sign-ins"
3. This allows users to play without creating an account

## 4. Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel:
   - Go to your project settings
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Testing

After setup, test the connection by checking the browser console for any Supabase errors when loading the game. 