'use client';

import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createClient } from '../../lib/supabase';

export default function PvpPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user, loading } = useAuth();
  
  // Simple state - no complex dependencies
  const [gameState, setGameState] = useState<'idle' | 'queued' | 'matched' | 'playing' | 'ended'>('idle');
  const [matchId, setMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  
  // Game data as refs to avoid re-renders
  const gameDataRef = useRef({
    isPlayer1: false,
    localPlayer: { x: 100, y: 250, health: 100 },
    opponentPlayer: { x: 700, y: 250, health: 100 },
    fireballs: [] as any[],
    keys: { w: false, s: false, a: false, d: false }
  });

  const channelRef = useRef<any>(null);

  // Join queue function
  const joinQueue = async () => {
    try {
      setGameState('queued');
      setError(null);

      const response = await fetch('/api/pvp/queue', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      if (data.message === 'Matched') {
        console.log('Immediately matched!');
        setMatchId(data.match.id);
        gameDataRef.current.isPlayer1 = user!.id === data.match.player1_id;
        setGameState('matched');
        setupMatch(data.match.id);
      } else {
        console.log('Queued, polling for match...');
        startPolling();
      }
    } catch (err: any) {
      setError(err.message);
      setGameState('idle');
    }
  };

  // Simple polling
  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/pvp/queue');
        const data = await response.json();

        if (data.status === 'matched') {
          clearInterval(interval);
          setMatchId(data.match.id);
          gameDataRef.current.isPlayer1 = user!.id === data.match.player1_id;
          setGameState('matched');
          setupMatch(data.match.id);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    // Store interval to clean up
    (window as any).pollInterval = interval;
  };

  // Setup match and start game
  const setupMatch = (matchId: string) => {
    console.log('Setting up match:', matchId);
    
    const supabase = createClient();
    const channel = supabase.channel(`pvp:${matchId}`);
    
    // Set initial positions
    if (gameDataRef.current.isPlayer1) {
      gameDataRef.current.localPlayer = { x: 100, y: 250, health: 100 };
      gameDataRef.current.opponentPlayer = { x: 700, y: 250, health: 100 };
    } else {
      gameDataRef.current.localPlayer = { x: 700, y: 250, health: 100 };
      gameDataRef.current.opponentPlayer = { x: 100, y: 250, health: 100 };
    }

    channel
      .on('broadcast', { event: 'player_update' }, ({ payload }) => {
        if (payload.userId !== user!.id) {
          gameDataRef.current.opponentPlayer = { ...gameDataRef.current.opponentPlayer, ...payload.state };
        }
      })
      .subscribe(async (status) => {
        console.log('Channel status:', status);
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel;
          console.log('Channel connected, starting game immediately...');
          
          // Start the game immediately when channel is connected
          setGameState('playing');
          
          // Small delay to ensure state is updated, then start game
          setTimeout(() => {
            startGame();
          }, 100);
        }
      });
  };

  // Start the actual game
  const startGame = () => {
    // Prevent multiple game starts
    if ((window as any).gameStarted) {
      console.log('Game already started, skipping...');
      return;
    }
    (window as any).gameStarted = true;
    
    console.log('Game starting!');
    
    // Set up controls FIRST
    setupControls();
    
    // Use a ref to control the game loop
    let gameRunning = true;
    
    // Simple game loop - always render if we have a canvas
    const gameLoop = () => {
      // Debug: log game loop execution
      console.log('Game loop running, gameState:', gameState);
      
      updateGame();
      renderGame();
      
      // Keep running as long as gameRunning is true
      if (gameRunning) {
        requestAnimationFrame(gameLoop);
      } else {
        console.log('Game loop stopped');
      }
    };
    
    // Store stop function globally so we can stop it later
    (window as any).stopGame = () => {
      gameRunning = false;
    };
    
    // Start broadcasting player position
    const broadcastInterval = setInterval(() => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'player_update',
          payload: { 
            userId: user!.id, 
            state: gameDataRef.current.localPlayer 
          }
        });
      }
    }, 100);

    (window as any).broadcastInterval = broadcastInterval;
    
    // Start game loop
    console.log('Starting game loop...');
    requestAnimationFrame(gameLoop);
  };

  // Simple game update
  const updateGame = () => {
    const player = gameDataRef.current.localPlayer;
    const keys = gameDataRef.current.keys;
    const speed = 5;

    // Debug: log player position and key states
    const anyKeyPressed = keys.w || keys.s || keys.a || keys.d;
    if (anyKeyPressed) {
      console.log('Keys:', keys, 'Player pos before:', player.x, player.y);
    }

    // Move player based on keys
    if (keys.w) player.y = Math.max(0, player.y - speed);
    if (keys.s) player.y = Math.min(550, player.y + speed);
    if (keys.a) player.x = Math.max(0, player.x - speed);
    if (keys.d) player.x = Math.min(750, player.x + speed);

    // Debug: log player position after movement
    if (anyKeyPressed) {
      console.log('Player pos after:', player.x, player.y);
    }

    // Simple win condition
    if (gameDataRef.current.localPlayer.health <= 0) {
      setGameState('ended');
      setWinner('Opponent');
    }
    if (gameDataRef.current.opponentPlayer.health <= 0) {
      setGameState('ended');
      setWinner('You');
    }
  };

  // Simple render
  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 800, 600);

    // Draw local player (blue)
    ctx.fillStyle = 'blue';
    ctx.fillRect(gameDataRef.current.localPlayer.x, gameDataRef.current.localPlayer.y, 50, 50);

    // Draw opponent (red)
    ctx.fillStyle = 'red';
    ctx.fillRect(gameDataRef.current.opponentPlayer.x, gameDataRef.current.opponentPlayer.y, 50, 50);

    // Draw health bars
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Your Health: ${gameDataRef.current.localPlayer.health}`, 10, 30);
    ctx.fillText(`Opponent Health: ${gameDataRef.current.opponentPlayer.health}`, 10, 50);
  };

  // Simple controls
  const setupControls = () => {
    // Remove existing handlers first
    if ((window as any).keyHandlers) {
      window.removeEventListener('keydown', (window as any).keyHandlers.handleKeyDown);
      window.removeEventListener('keyup', (window as any).keyHandlers.handleKeyUp);
    }

    console.log('Setting up controls...');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key down:', e.key);
      const keys = gameDataRef.current.keys;
      switch (e.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 's': keys.s = true; break;
        case 'a': keys.a = true; break;
        case 'd': keys.d = true; break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = gameDataRef.current.keys;
      switch (e.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 's': keys.s = false; break;
        case 'a': keys.a = false; break;
        case 'd': keys.d = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Store for cleanup
    (window as any).keyHandlers = { handleKeyDown, handleKeyUp };
    console.log('Controls set up successfully!');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up game...');
      (window as any).gameStarted = false; // Reset game started flag
      if ((window as any).pollInterval) clearInterval((window as any).pollInterval);
      if ((window as any).broadcastInterval) clearInterval((window as any).broadcastInterval);
      if ((window as any).keyHandlers) {
        window.removeEventListener('keydown', (window as any).keyHandlers.handleKeyDown);
        window.removeEventListener('keyup', (window as any).keyHandlers.handleKeyUp);
      }
      if (channelRef.current) {
        const supabase = createClient();
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <div className="flex items-center justify-center h-screen">Logging in...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl mb-8">Ammo Cat PVP</h1>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-white mb-4"
      />

      {error && (
        <div className="bg-red-500 p-4 rounded-lg mb-4">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-sm">Close</button>
        </div>
      )}

      {gameState === 'idle' && (
        <button
          onClick={joinQueue}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl"
        >
          Join Queue
        </button>
      )}

      {gameState === 'queued' && (
        <div className="text-center">
          <p className="text-xl">Waiting for opponent...</p>
          <button
            onClick={() => setGameState('idle')}
            className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg"
          >
            Leave Queue
          </button>
        </div>
      )}

      {gameState === 'matched' && (
        <p className="text-xl text-green-500">Match found! Starting game...</p>
      )}

      {gameState === 'playing' && (
        <div className="text-center">
          <p className="text-xl text-green-500">Game in progress!</p>
          <p className="text-sm mt-2">Use WASD to move</p>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center">
          <p className="text-4xl font-bold mb-4">
            {winner === 'You' ? 'You Win!' : 'You Lose!'}
          </p>
          <button
            onClick={() => {
              setGameState('idle');
              setWinner(null);
              setMatchId(null);
            }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
} 