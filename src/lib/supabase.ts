import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// For backward compatibility with existing imports
export const supabase = createClient();

export type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
}; 