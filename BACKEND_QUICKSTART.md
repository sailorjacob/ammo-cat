# AMMOCAT Backend Quick Start

## 1. Supabase Setup (5 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for it to initialize

2. **Get API Keys**
   - Go to Settings → API
   - Copy these values:
     - Project URL
     - anon public key

3. **Create `.env.local`** in your project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Enable Anonymous Auth**
   - Go to Authentication → Providers
   - Enable "Anonymous Sign-ins"

5. **Run Database Setup**
   - Go to SQL Editor
   - Copy and run this entire SQL block:

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
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```

## 2. Deploy to Vercel (3 minutes)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Supabase backend"
   git push
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy!

## That's it! 🎉

Your game now has a global leaderboard. Players will:
- Automatically sign in anonymously
- Submit scores to the global leaderboard
- View top 10 world scores

## Testing Locally

```bash
npm run dev
```

Then play the game and check if scores are saving to Supabase!

## Troubleshooting

- **Scores not saving?** Check browser console for errors
- **Can't see leaderboard?** Make sure anonymous auth is enabled
- **Getting CORS errors?** Check your Supabase URL is correct 