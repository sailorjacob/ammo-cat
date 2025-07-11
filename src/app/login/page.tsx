"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async () => {
    setError(null);
    if (!supabase) {
      setError('Supabase not configured');
      return;
    }
    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }
      if (result.error) throw result.error;
      router.push('/pvp');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl mb-8">{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="mb-4 p-2 text-black rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mb-4 p-2 text-black rounded"
      />
      <button
        onClick={handleAuth}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl mb-4"
      >
        {isSignUp ? 'Sign Up' : 'Login'}
      </button>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm underline"
      >
        {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
} 