-- Create PVP Queue table
CREATE TABLE IF NOT EXISTS pvp_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'matched')),
  match_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PVP Matches table
CREATE TABLE IF NOT EXISTS pvp_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  player2_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  winner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PVP Stats table
CREATE TABLE IF NOT EXISTS pvp_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Leaderboard table (if not exists)
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for match_id in pvp_queue
ALTER TABLE pvp_queue 
ADD CONSTRAINT fk_pvp_queue_match 
FOREIGN KEY (match_id) REFERENCES pvp_matches(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE pvp_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE pvp_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE pvp_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pvp_queue
CREATE POLICY "Users can view their own queue entries" ON pvp_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queue entries" ON pvp_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own queue entries" ON pvp_queue
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own queue entries" ON pvp_queue
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for pvp_matches
CREATE POLICY "Users can view matches they participate in" ON pvp_matches
  FOR SELECT USING (auth.uid() IN (player1_id, player2_id));

CREATE POLICY "Users can insert matches" ON pvp_matches
  FOR INSERT WITH CHECK (auth.uid() IN (player1_id, player2_id));

CREATE POLICY "Users can update matches they participate in" ON pvp_matches
  FOR UPDATE USING (auth.uid() IN (player1_id, player2_id));

-- RLS Policies for pvp_stats
CREATE POLICY "Users can view all stats" ON pvp_stats
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own stats" ON pvp_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON pvp_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for leaderboard
CREATE POLICY "Anyone can view leaderboard" ON leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Users can insert scores" ON leaderboard
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pvp_queue_user_status ON pvp_queue(user_id, status);
CREATE INDEX IF NOT EXISTS idx_pvp_queue_status ON pvp_queue(status);
CREATE INDEX IF NOT EXISTS idx_pvp_matches_players ON pvp_matches(player1_id, player2_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC); 