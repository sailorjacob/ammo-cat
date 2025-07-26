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
  const [hitEffect, setHitEffect] = useState(false);
  
  // Game data as refs to avoid re-renders
  const gameDataRef = useRef({
    isPlayer1: false,
    localPlayer: { x: 100, y: 250, health: 100 },
    opponentPlayer: { x: 700, y: 250, health: 100 },
    fireballs: [] as Array<{x: number, y: number, playerId: string, speed: number, curve?: number}>,
    keys: { w: false, s: false, a: false, d: false, space: false },
    lastShot: null as number | null,
    explosions: [] as Array<{x: number, y: number, size: number, life: number, maxLife: number}>
  });

  const channelRef = useRef<any>(null);
  
  // Image refs for sprites - loaded once
  const imagesRef = useRef({
    player: null as HTMLImageElement | null,
    loaded: false
  });

  // Load game images
  useEffect(() => {
    const loadImages = () => {
      const playerImage = new Image();
      playerImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png";
      
      playerImage.onload = () => {
        imagesRef.current.player = playerImage;
        imagesRef.current.loaded = true;
        console.log('Player sprites loaded successfully');
      };
      
      playerImage.onerror = () => {
        console.error('Failed to load player sprite');
      };
    };
    
    loadImages();
  }, []);

  // Player hit function with visual effects
  const playerHit = (isLocal: boolean) => {
    // Show hit effect
    setHitEffect(true);
    
    // Reset hit effect after a short delay
    setTimeout(() => {
      setHitEffect(false);
    }, 300);
    
    // Add explosion effect at hit location
    const player = isLocal ? gameDataRef.current.localPlayer : gameDataRef.current.opponentPlayer;
    gameDataRef.current.explosions.push({
      x: player.x + 25,
      y: player.y + 25,
      size: 0,
      life: 30,
      maxLife: 30
    });
  };

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
      .on('broadcast', { event: 'fireball_shot' }, ({ payload }) => {
        if (payload.userId !== user!.id) {
          // Add opponent's fireball with curve
          gameDataRef.current.fireballs.push({
            x: payload.x,
            y: payload.y,
            playerId: payload.userId,
            speed: payload.speed,
            curve: payload.curve || 0
          });
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

  // Game update with shooting and effects
  const updateGame = () => {
    const player = gameDataRef.current.localPlayer;
    const keys = gameDataRef.current.keys;
    const speed = 5;

    // Move player based on keys
    if (keys.w) player.y = Math.max(0, player.y - speed);
    if (keys.s) player.y = Math.min(550, player.y + speed);
    if (keys.a) player.x = Math.max(0, player.x - speed);
    if (keys.d) player.x = Math.min(750, player.x + speed);

    // Handle shooting with cooldown
    if (keys.space && !gameDataRef.current.lastShot) {
      shootFireball();
      gameDataRef.current.lastShot = Date.now();
    }
    
    // Reset shooting cooldown after 200ms
    if (gameDataRef.current.lastShot && Date.now() - gameDataRef.current.lastShot > 200) {
      gameDataRef.current.lastShot = null;
    }

    // Update fireballs with visual effects
    for (let i = gameDataRef.current.fireballs.length - 1; i >= 0; i--) {
      const fireball = gameDataRef.current.fireballs[i];
      
      // Determine shooting direction based on player position
      // Player1 is on left side and shoots right (+)
      // Player2 is on right side and shoots left (-)
      const isPlayer1Fireball = (fireball.playerId === user!.id && gameDataRef.current.isPlayer1) ||
                                (fireball.playerId !== user!.id && !gameDataRef.current.isPlayer1);
      
      // Move fireball in correct direction
      if (isPlayer1Fireball) {
        fireball.x += fireball.speed; // Player1 shoots right
      } else {
        fireball.x -= fireball.speed; // Player2 shoots left
      }
      
      // Apply curve effect
      if (fireball.curve) {
        fireball.y += fireball.curve;
      }
      
      // Remove fireballs that are off-screen
      if (fireball.x < -20 || fireball.x > 820 || fireball.y < -20 || fireball.y > 620) {
        gameDataRef.current.fireballs.splice(i, 1);
        continue;
      }
      
      // Check collision with opponent
      const targetPlayer = fireball.playerId === user!.id ? 
        gameDataRef.current.opponentPlayer : gameDataRef.current.localPlayer;
      
      if (fireball.x < targetPlayer.x + 50 &&
          fireball.x + 10 > targetPlayer.x &&
          fireball.y < targetPlayer.y + 50 &&
          fireball.y + 10 > targetPlayer.y) {
        
        // Hit! Remove fireball and damage player
        gameDataRef.current.fireballs.splice(i, 1);
        
        if (fireball.playerId !== user!.id) {
          // We got hit
          gameDataRef.current.localPlayer.health -= 20;
          playerHit(true);
        } else {
          // We hit opponent
          gameDataRef.current.opponentPlayer.health -= 20;
          playerHit(false);
        }
      }
    }

    // Update explosions
    for (let i = gameDataRef.current.explosions.length - 1; i >= 0; i--) {
      const explosion = gameDataRef.current.explosions[i];
      explosion.life--;
      explosion.size = ((explosion.maxLife - explosion.life) / explosion.maxLife) * 40;
      
      if (explosion.life <= 0) {
        gameDataRef.current.explosions.splice(i, 1);
      }
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

  // Shoot fireball function
  const shootFireball = () => {
    const player = gameDataRef.current.localPlayer;
    const curve = (Math.random() - 0.5) * 2; // Random curve like original game
    
    // Determine fireball start position based on which player is shooting
    const isPlayer1 = gameDataRef.current.isPlayer1;
    const startX = isPlayer1 ? player.x + 50 : player.x; // Player1 shoots from right edge, Player2 from left edge
    
    const fireball = {
      x: startX,
      y: player.y + 25, // Center vertically
      playerId: user!.id,
      speed: 7,
      curve: curve
    };
    
    gameDataRef.current.fireballs.push(fireball);
    
    // Broadcast fireball to opponent
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'fireball_shot',
        payload: {
          userId: user!.id,
          x: fireball.x,
          y: fireball.y,
          speed: fireball.speed,
          curve: fireball.curve
        }
      });
    }
  };

  // Render with sprites and effects
  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 800, 600);

    // Determine directions - Player1 faces right, Player2 faces left
    const localPlayerFacesRight = gameDataRef.current.isPlayer1;
    const opponentPlayerFacesRight = !gameDataRef.current.isPlayer1;

    // Draw local player with correct orientation
    if (imagesRef.current.loaded && imagesRef.current.player) {
      try {
        ctx.save();
        if (!localPlayerFacesRight) {
          // Flip sprite horizontally for player2 (faces left)
          ctx.scale(-1, 1);
          ctx.drawImage(imagesRef.current.player,
            -(gameDataRef.current.localPlayer.x + 50),
            gameDataRef.current.localPlayer.y,
            50, 50);
        } else {
          // Normal orientation for player1 (faces right)
          ctx.drawImage(imagesRef.current.player, 
            gameDataRef.current.localPlayer.x, 
            gameDataRef.current.localPlayer.y, 
            50, 50);
        }
        ctx.restore();
      } catch (e) {
        // Fallback to colored rectangle
        ctx.fillStyle = 'blue';
        ctx.fillRect(gameDataRef.current.localPlayer.x, gameDataRef.current.localPlayer.y, 50, 50);
      }
    } else {
      // Fallback while loading
      ctx.fillStyle = 'blue';
      ctx.fillRect(gameDataRef.current.localPlayer.x, gameDataRef.current.localPlayer.y, 50, 50);
    }

    // Draw opponent with correct orientation
    if (imagesRef.current.loaded && imagesRef.current.player) {
      try {
        ctx.save();
        if (!opponentPlayerFacesRight) {
          // Flip sprite horizontally for player2 (faces left)
          ctx.scale(-1, 1);
          ctx.drawImage(imagesRef.current.player,
            -(gameDataRef.current.opponentPlayer.x + 50),
            gameDataRef.current.opponentPlayer.y,
            50, 50);
        } else {
          // Normal orientation for player1 (faces right)
          ctx.drawImage(imagesRef.current.player,
            gameDataRef.current.opponentPlayer.x,
            gameDataRef.current.opponentPlayer.y,
            50, 50);
        }
        ctx.restore();
      } catch (e) {
        // Fallback to colored rectangle
        ctx.fillStyle = 'red';
        ctx.fillRect(gameDataRef.current.opponentPlayer.x, gameDataRef.current.opponentPlayer.y, 50, 50);
      }
    } else {
      // Fallback while loading
      ctx.fillStyle = 'red';
      ctx.fillRect(gameDataRef.current.opponentPlayer.x, gameDataRef.current.opponentPlayer.y, 50, 50);
    }

    // Draw fireballs with glow effect
    gameDataRef.current.fireballs.forEach(fireball => {
      ctx.save();
      
      // Add glow effect
      ctx.shadowColor = fireball.playerId === user!.id ? '#000000' : '#FF5500';
      ctx.shadowBlur = 10;
      
      ctx.fillStyle = fireball.playerId === user!.id ? '#000000' : '#FF5500';
      ctx.beginPath();
      ctx.arc(fireball.x + 5, fireball.y + 5, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });

    // Draw explosions
    gameDataRef.current.explosions.forEach(explosion => {
      if (explosion.size > 0) {
        ctx.save();
        ctx.globalAlpha = explosion.life / explosion.maxLife;
        
        // Outer explosion circle
        ctx.fillStyle = '#FF6600';
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner explosion circle
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    });

    // Apply hit effect to entire canvas
    if (hitEffect) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(0, 0, 800, 600);
      ctx.restore();
    }

    // Draw health bars with gradient effects
    const barWidth = 150;
    const barHeight = 20;
    
    // Local player health bar (bottom left)
    ctx.fillStyle = '#333333';
    ctx.fillRect(10, 560, barWidth, barHeight);
    
    // Health bar gradient
    const localHealthPercent = gameDataRef.current.localPlayer.health / 100;
    const localGradient = ctx.createLinearGradient(10, 560, 10 + barWidth, 560);
    if (localHealthPercent > 0.5) {
      localGradient.addColorStop(0, '#00FF00');
      localGradient.addColorStop(1, '#7FFF00');
    } else if (localHealthPercent > 0.25) {
      localGradient.addColorStop(0, '#FFFF00');
      localGradient.addColorStop(1, '#FFA500');
    } else {
      localGradient.addColorStop(0, '#FF0000');
      localGradient.addColorStop(1, '#8B0000');
    }
    
    ctx.fillStyle = localGradient;
    ctx.fillRect(10, 560, localHealthPercent * barWidth, barHeight);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Your Health: ${gameDataRef.current.localPlayer.health}`, 10, 555);

    // Opponent health bar (bottom right)
    ctx.fillStyle = '#333333';
    ctx.fillRect(640, 560, barWidth, barHeight);
    
    const opponentHealthPercent = gameDataRef.current.opponentPlayer.health / 100;
    const opponentGradient = ctx.createLinearGradient(640, 560, 640 + barWidth, 560);
    if (opponentHealthPercent > 0.5) {
      opponentGradient.addColorStop(0, '#00FF00');
      opponentGradient.addColorStop(1, '#7FFF00');
    } else if (opponentHealthPercent > 0.25) {
      opponentGradient.addColorStop(0, '#FFFF00');
      opponentGradient.addColorStop(1, '#FFA500');
    } else {
      opponentGradient.addColorStop(0, '#FF0000');
      opponentGradient.addColorStop(1, '#8B0000');
    }
    
    ctx.fillStyle = opponentGradient;
    ctx.fillRect(640, 560, opponentHealthPercent * barWidth, barHeight);
    ctx.fillStyle = '#000000';
    ctx.fillText(`Opponent Health: ${gameDataRef.current.opponentPlayer.health}`, 640, 555);
  };

  // Controls with shooting and mouse support
  const setupControls = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Remove existing handlers first
    if ((window as any).keyHandlers) {
      window.removeEventListener('keydown', (window as any).keyHandlers.handleKeyDown);
      window.removeEventListener('keyup', (window as any).keyHandlers.handleKeyUp);
    }
    if ((window as any).mouseHandlers) {
      canvas.removeEventListener('mousedown', (window as any).mouseHandlers.handleMouseDown);
      canvas.removeEventListener('mouseup', (window as any).mouseHandlers.handleMouseUp);
    }

    console.log('Setting up controls with mouse support...');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = gameDataRef.current.keys;
      switch (e.key.toLowerCase()) {
        case 'w': keys.w = true; e.preventDefault(); break;
        case 's': keys.s = true; e.preventDefault(); break;
        case 'a': keys.a = true; e.preventDefault(); break;
        case 'd': keys.d = true; e.preventDefault(); break;
        case ' ': keys.space = true; e.preventDefault(); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = gameDataRef.current.keys;
      switch (e.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 's': keys.s = false; break;
        case 'a': keys.a = false; break;
        case 'd': keys.d = false; break;
        case ' ': keys.space = false; break;
      }
    };

    // Mouse handlers for shooting
    const handleMouseDown = (e: MouseEvent) => {
      if (gameState !== 'playing') return;
      
      // Shoot when mouse is pressed
      if (!gameDataRef.current.lastShot) {
        shootFireball();
        gameDataRef.current.lastShot = Date.now();
      }
    };

    const handleMouseUp = () => {
      // Mouse shooting is handled by the cooldown system
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Store for cleanup
    (window as any).keyHandlers = { handleKeyDown, handleKeyUp };
    (window as any).mouseHandlers = { handleMouseDown, handleMouseUp };
    console.log('Controls with mouse support set up successfully!');
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
      if ((window as any).mouseHandlers && canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', (window as any).mouseHandlers.handleMouseDown);
        canvasRef.current.removeEventListener('mouseup', (window as any).mouseHandlers.handleMouseUp);
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
      <h1 className="text-4xl mb-8">🔥 Ammo Cat PVP 🔥</h1>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={`border border-white mb-4 bg-white ${hitEffect ? 'opacity-70' : ''}`}
        style={{
          filter: hitEffect ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 0.8))' : 'none'
        }}
      />

      {error && (
        <div className="bg-red-500 p-4 rounded-lg mb-4">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-sm">Close</button>
        </div>
      )}

      {gameState === 'idle' && (
        <div className="text-center">
          <button
            onClick={joinQueue}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl mb-4"
          >
            🎯 Join PVP Match
          </button>
          <p className="text-sm text-gray-300">Real-time multiplayer with sprites, explosions & visual effects!</p>
        </div>
      )}

      {gameState === 'queued' && (
        <div className="text-center">
          <p className="text-xl">🔍 Searching for opponent...</p>
          <button
            onClick={() => setGameState('idle')}
            className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg"
          >
            Leave Queue
          </button>
        </div>
      )}

      {gameState === 'matched' && (
        <p className="text-xl text-green-500">🎉 Match found! Loading PVP battle...</p>
      )}

      {gameState === 'playing' && (
        <div className="text-center">
          <p className="text-xl text-green-500">⚔️ Epic PVP Battle in Progress!</p>
          <p className="text-sm mt-2">WASD to move • SPACEBAR or MOUSE to shoot fireballs</p>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="text-center">
          <p className="text-4xl font-bold mb-4">
            {winner === 'You' ? '🏆 Victory!' : '💀 Defeat!'}
          </p>
          <button
            onClick={() => {
              setGameState('idle');
              setWinner(null);
              setMatchId(null);
              // Reset game data
              gameDataRef.current.fireballs = [];
              gameDataRef.current.explosions = [];
              gameDataRef.current.localPlayer.health = 100;
              gameDataRef.current.opponentPlayer.health = 100;
            }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl"
          >
            🔥 Battle Again
          </button>
        </div>
      )}
    </div>
  );
} 