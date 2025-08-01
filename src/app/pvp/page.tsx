'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../hooks/useAuth';
import { createClient } from '../../lib/supabase';

// PVP Leaderboard entry type
type PvpLeaderboardEntry = {
  player_name: string;
  wins: number;
  created_at: string;
};

export default function PvpPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user, loading } = useAuth();
  
  // Simple state - no complex dependencies
  const [gameState, setGameState] = useState<'idle' | 'queued' | 'matched' | 'playing' | 'ended'>('idle');
  const [matchId, setMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [hitEffect, setHitEffect] = useState(false);
  
  // Leaderboard states
  const [leaderboard, setLeaderboard] = useState<PvpLeaderboardEntry[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Rematch states
  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchReceived, setRematchReceived] = useState(false);
  const [rematchAccepted, setRematchAccepted] = useState(false);
  const [localPlayerReady, setLocalPlayerReady] = useState(false);
  const [opponentPlayerReady, setOpponentPlayerReady] = useState(false);
  
  // Lives state for UI updates
  const [localLives, setLocalLives] = useState(4);
  const [opponentLives, setOpponentLives] = useState(4);
  
  // User wins state for UI updates
  const [userWins, setUserWins] = useState(0);
  
  // Mobile detection state
  const [isMobile, setIsMobile] = useState(false);
  
  // Game data as refs to avoid re-renders
  const gameDataRef = useRef({
    isPlayer1: false,
    localPlayer: { x: 100, y: 250, health: 100, lives: 4 },
    opponentPlayer: { x: 700, y: 250, health: 100, lives: 4 },
    fireballs: [] as Array<{x: number, y: number, playerId: string, speed: number, curve?: number}>,
    keys: { w: false, s: false, a: false, d: false, space: false },
    lastShot: null as number | null,
    explosions: [] as Array<{x: number, y: number, size: number, life: number, maxLife: number}>,
    spaceHeld: false,
    spaceHoldStart: null as number | null,
    mouseHeld: false,
    mouseHoldStart: null as number | null
  });

  const channelRef = useRef<any>(null);
  
  // Image refs for sprites - loaded once
  const imagesRef = useRef({
    player: null as HTMLImageElement | null,
    loaded: false
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load game images
  useEffect(() => {
    const loadImages = () => {
      const playerImage = new window.Image();
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

  // Load PVP leaderboard from backend
  useEffect(() => {
    const loadPvpLeaderboard = async () => {
      try {
        const response = await fetch('/api/pvp/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Failed to load PVP leaderboard:', error);
        // Fallback to localStorage if API fails
        const savedLeaderboard = localStorage.getItem('ammocat-pvp-leaderboard');
        if (savedLeaderboard) {
          setLeaderboard(JSON.parse(savedLeaderboard));
        }
      }
    };
    
    loadPvpLeaderboard();
  }, []);

  // Initialize user wins from localStorage
  useEffect(() => {
    if (user && typeof localStorage !== 'undefined') {
      const wins = parseInt(localStorage.getItem(`pvp_wins_${user.id}`) || '0');
      setUserWins(wins);
    }
  }, [user]);

  // Save win to PVP leaderboard
  const saveWinToLeaderboard = async (name: string) => {
    const playerName = name.trim() || 'Anonymous';
    
    // Increment individual user wins counter
    if (user && typeof localStorage !== 'undefined') {
      const currentWins = parseInt(localStorage.getItem(`pvp_wins_${user.id}`) || '0');
      const newWins = currentWins + 1;
      localStorage.setItem(`pvp_wins_${user.id}`, newWins.toString());
      setUserWins(newWins);
    }
    
    try {
      // Save to backend
      const response = await fetch('/api/pvp/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_name: playerName
        })
      });
      
      if (response.ok) {
        // Reload leaderboard after successful save
        const leaderboardResponse = await fetch('/api/pvp/leaderboard');
        if (leaderboardResponse.ok) {
          const data = await leaderboardResponse.json();
          setLeaderboard(data);
        }
      } else {
        throw new Error('Failed to save win');
      }
    } catch (error) {
      console.error('Failed to save win to backend:', error);
      
      // Fallback to localStorage if API fails
      const existingEntry = leaderboard.find(entry => entry.player_name === playerName);
      let updatedLeaderboard;
      
      if (existingEntry) {
        updatedLeaderboard = leaderboard.map(entry => 
          entry.player_name === playerName 
            ? { ...entry, wins: entry.wins + 1 }
            : entry
        );
      } else {
        const newEntry: PvpLeaderboardEntry = {
          player_name: playerName,
          wins: 1,
          created_at: new Date().toISOString()
        };
        updatedLeaderboard = [...leaderboard, newEntry];
      }
      
      updatedLeaderboard.sort((a, b) => b.wins - a.wins);
      updatedLeaderboard = updatedLeaderboard.slice(0, 10);
      
      setLeaderboard(updatedLeaderboard);
      localStorage.setItem('ammocat-pvp-leaderboard', JSON.stringify(updatedLeaderboard));
    }
  };

  // Player hit function with visual effects and lives system
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
    
    // Check if player died (health <= 0)
    if (player.health <= 0) {
      // Reduce lives
      player.lives--;
      
      // Update UI state
      if (isLocal) {
        setLocalLives(player.lives);
      } else {
        setOpponentLives(player.lives);
      }
      
      // Broadcast lives update (always send local player's lives)
      if (channelRef.current && isLocal) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'lives_update',
          payload: { 
            userId: user!.id, 
            lives: gameDataRef.current.localPlayer.lives
          }
        });
      }
      
      // Check if player has lives left
      if (player.lives > 0) {
        // Respawn the player
        player.health = 100;
        
        // Reset position based on which player
        if (isLocal) {
          if (gameDataRef.current.isPlayer1) {
            player.x = 100;
            player.y = 250;
          } else {
            player.x = 700;
            player.y = 250;
          }
        } else {
          if (gameDataRef.current.isPlayer1) {
            player.x = 700;
            player.y = 250;
          } else {
            player.x = 100;
            player.y = 250;
          }
        }
        
        console.log(`Player respawned with ${player.lives} lives remaining`);
      } else {
        // No lives left - game over
        if (isLocal) {
          console.log('Local player out of lives - ending game');
          endGame('Opponent');
        } else {
          console.log('Opponent out of lives - ending game');
          endGame('You');
        }
      }
    }
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
      gameDataRef.current.localPlayer = { x: 100, y: 250, health: 100, lives: 4 };
      gameDataRef.current.opponentPlayer = { x: 700, y: 250, health: 100, lives: 4 };
    } else {
      gameDataRef.current.localPlayer = { x: 700, y: 250, health: 100, lives: 4 };
      gameDataRef.current.opponentPlayer = { x: 100, y: 250, health: 100, lives: 4 };
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
      .on('broadcast', { event: 'rematch_request' }, ({ payload }) => {
        if (payload.userId !== user!.id) {
          setRematchReceived(true);
        }
      })
      .on('broadcast', { event: 'rematch_accepted' }, ({ payload }) => {
        if (payload.userId !== user!.id) {
          // Reset rematch states and enter ready phase
          setRematchReceived(false);
          setRematchRequested(false);
          setRematchAccepted(true);
          setLocalPlayerReady(false);
          setOpponentPlayerReady(false);
        }
      })
      .on('broadcast', { event: 'player_ready' }, ({ payload }) => {
        if (payload.userId !== user!.id) {
          setOpponentPlayerReady(true);
        }
        // Removed problematic else branch that should never execute
      })
      .on('broadcast', { event: 'lives_update' }, ({ payload }) => {
        if (payload.userId === user!.id) {
          // Update local lives state
          if (payload.lives !== undefined) {
            gameDataRef.current.localPlayer.lives = payload.lives;
            setLocalLives(payload.lives);
          }
        } else {
          // Update opponent's lives state
          if (payload.lives !== undefined) {
            gameDataRef.current.opponentPlayer.lives = payload.lives;
            setOpponentLives(payload.lives);
          }
        }
      })
      .on('broadcast', { event: 'game_end' }, ({ payload }) => {
        if (payload.userId !== user!.id && gameState === 'playing') {
          console.log('Received game end broadcast from opponent:', payload.winner);
          // Synchronize game end state from opponent
          const localWinner = payload.winner === 'You' ? 'Opponent' : 'You';
          endGame(localWinner);
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
      // SAFETY: Immediately stop if game has ended
      if (gameState === 'ended') {
        gameRunning = false;
        console.log('Game loop stopped due to ended state');
        return;
      }

      // Always update and render
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
    // CRITICAL: Stop all game updates immediately if game has ended or is not playing
    if (gameState !== 'playing') {
      return;
    }

    const player = gameDataRef.current.localPlayer;
    const keys = gameDataRef.current.keys;
    const speed = 5;

    // Move player based on keys (only if not typing in modal and game is active)
    if (!showNameInput && !showLeaderboard && gameState === 'playing') {
      if (keys.w) player.y = Math.max(0, player.y - speed);
      if (keys.s) player.y = Math.min(550, player.y + speed);
      if (keys.a) player.x = Math.max(0, player.x - speed);
      if (keys.d) player.x = Math.min(750, player.x + speed);

      // Handle shooting - allow rapid fire on tap, rate limit on hold
      if (keys.space) {
        const now = Date.now();
        
        // If first shot or enough time has passed, shoot
        if (!gameDataRef.current.lastShot || now - gameDataRef.current.lastShot > 200) {
          shootFireball();
          gameDataRef.current.lastShot = now;
        }
        
        // Track if spacebar was held vs tapped
        if (!gameDataRef.current.spaceHeld) {
          gameDataRef.current.spaceHeld = true;
          gameDataRef.current.spaceHoldStart = now;
        }
      }
      
      // Reset shooting state when spacebar is released
      if (!keys.space && gameDataRef.current.spaceHeld) {
        gameDataRef.current.spaceHeld = false;
        gameDataRef.current.lastShot = null; // Allow immediate next shot on tap
      }
    }

    // Update fireballs with visual effects (only if game is still playing)
    if (gameState === 'playing') {
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
        
        // Check collision with opponent (only if game is still playing)
        if (gameState === 'playing') {
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
      }
    }

    // Update explosions (only if game is playing)
    if (gameState === 'playing') {
      for (let i = gameDataRef.current.explosions.length - 1; i >= 0; i--) {
        const explosion = gameDataRef.current.explosions[i];
        explosion.life--;
        explosion.size = ((explosion.maxLife - explosion.life) / explosion.maxLife) * 40;
        
        if (explosion.life <= 0) {
          gameDataRef.current.explosions.splice(i, 1);
        }
      }
    }

    // CRITICAL: Win condition check (only if game is still playing)
    if (gameState === 'playing') {
      // Check for game end conditions based on lives, not health
      if (gameDataRef.current.localPlayer.lives <= 0) {
        console.log('Local player out of lives - ending game');
        endGame('Opponent');
      } else if (gameDataRef.current.opponentPlayer.lives <= 0) {
        console.log('Opponent out of lives - ending game');
        endGame('You');
      }
    }
  };

  // Centralized game ending function
  const endGame = (winner: string) => {
    console.log('Game ending with winner:', winner);
    
    // Immediately set game state to ended
    setGameState('ended');
    setWinner(winner);
    
    // Broadcast game end to opponent for synchronization
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'game_end',
        payload: { 
          userId: user!.id, 
          winner: winner 
        }
      });
    }
    
    // Stop the game loop immediately
    if ((window as any).stopGame) {
      (window as any).stopGame();
    }
    
    // Clear all intervals and timeouts
    if ((window as any).broadcastInterval) {
      clearInterval((window as any).broadcastInterval);
    }
    
    // Reset all movement keys to prevent continued movement
    if (gameDataRef.current.keys) {
      gameDataRef.current.keys.w = false;
      gameDataRef.current.keys.s = false;
      gameDataRef.current.keys.a = false;
      gameDataRef.current.keys.d = false;
      gameDataRef.current.keys.space = false;
    }
    
    // Show name input for winner
    if (winner === 'You') {
      setShowNameInput(true);
    }
    
    console.log('Game ended successfully');
  };

  // Start new game for rematch
  const startNewGame = () => {
    console.log('Starting new game for rematch...');
    
    // Clear any existing timeouts
    if ((window as any).readyTimeout) {
      clearTimeout((window as any).readyTimeout);
    }
    
    // Stop any running game loops first
    if ((window as any).stopGame) {
      (window as any).stopGame();
    }
    
    // Reset game started flag to allow new game to start
    (window as any).gameStarted = false;
    
    // Reset all game states
    setGameState('playing');
    setWinner(null);
    setRematchRequested(false);
    setRematchReceived(false);
    setRematchAccepted(false);
    setLocalPlayerReady(false);
    setOpponentPlayerReady(false);
    setShowNameInput(false);
    setPlayerName('');
    
    // Reset lives UI state
    setLocalLives(4);
    setOpponentLives(4);
    
    // Reset game data completely
    gameDataRef.current.fireballs = [];
    gameDataRef.current.explosions = [];
    
    // Reset player positions and stats
    if (gameDataRef.current.isPlayer1) {
      gameDataRef.current.localPlayer = { x: 100, y: 250, health: 100, lives: 4 };
      gameDataRef.current.opponentPlayer = { x: 700, y: 250, health: 100, lives: 4 };
    } else {
      gameDataRef.current.localPlayer = { x: 700, y: 250, health: 100, lives: 4 };
      gameDataRef.current.opponentPlayer = { x: 100, y: 250, health: 100, lives: 4 };
    }
    
    // Reset movement keys and shooting state
    if (gameDataRef.current.keys) {
      gameDataRef.current.keys.w = false;
      gameDataRef.current.keys.s = false;
      gameDataRef.current.keys.a = false;
      gameDataRef.current.keys.d = false;
      gameDataRef.current.keys.space = false;
    }
    
    // Reset shooting tracking variables
    gameDataRef.current.lastShot = null;
    gameDataRef.current.spaceHeld = false;
    gameDataRef.current.spaceHoldStart = null;
    gameDataRef.current.mouseHeld = false;
    gameDataRef.current.mouseHoldStart = null;
    
    // Small delay to ensure state updates, then restart the game
    setTimeout(() => {
      startGame();
    }, 100);
  };

  // Send rematch request
  const requestRematch = () => {
    if (channelRef.current) {
      setRematchRequested(true);
      channelRef.current.send({
        type: 'broadcast',
        event: 'rematch_request',
        payload: { userId: user!.id }
      });
    }
  };

  // Accept rematch
  const acceptRematch = () => {
    if (channelRef.current) {
      // Reset local rematch states
      setRematchReceived(false);
      setRematchRequested(false);
      setRematchAccepted(true);
      setLocalPlayerReady(false);
      setOpponentPlayerReady(false);
      
      // Send acceptance to opponent
      channelRef.current.send({
        type: 'broadcast',
        event: 'rematch_accepted',
        payload: { userId: user!.id }
      });
      
      // Set timeout to reset rematch states if opponent doesn't ready up
      setTimeout(() => {
        if (rematchAccepted && !opponentPlayerReady) {
          console.log('Opponent took too long to ready up, resetting rematch state');
          setRematchAccepted(false);
          setLocalPlayerReady(false);
          setOpponentPlayerReady(false);
        }
      }, 30000); // 30 second timeout
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

    // Render different content based on game state
    if (gameState === 'idle' || gameState === 'ended') {
      // Show intro/lobby content (like single-player ready state)
      if (imagesRef.current.loaded && imagesRef.current.player) {
        // Floating character in center
        ctx.save();
        try {
          ctx.drawImage(imagesRef.current.player, 
            375, 250, // Centered
            50, 50);
        } catch (e) {
          // Fallback
          ctx.fillStyle = '#0066FF';
          ctx.fillRect(375, 250, 50, 50);
        }
        ctx.restore();
        
        // Add "Ready for Battle" text
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Ready for PVP Battle', 400, 350);
        ctx.font = '16px Arial';
        ctx.fillText('Click "Join PVP Match" to begin', 400, 380);
      }
      return;
    }

    if (gameState !== 'playing') return;

    // Game playing state - render actual game
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
    if ((window as any).mouseHandlers && canvasRef.current) {
      canvasRef.current.removeEventListener('mousedown', (window as any).mouseHandlers.handleMouseDown);
      canvasRef.current.removeEventListener('mouseup', (window as any).mouseHandlers.handleMouseUp);
    }
    if ((window as any).touchHandlers && canvasRef.current) {
      canvasRef.current.removeEventListener('touchstart', (window as any).touchHandlers.handleTouchStart);
      canvasRef.current.removeEventListener('touchmove', (window as any).touchHandlers.handleTouchMove);
      canvasRef.current.removeEventListener('touchend', (window as any).touchHandlers.handleTouchEnd);
    }

    console.log('Setting up controls with mouse and touch support...');
    
    // Touch state for mobile controls
    let isDragging = false;
    let lastTouchX = 0;
    let lastTouchY = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle game keys if modal is open or game is not playing
      if (showNameInput || showLeaderboard || gameState !== 'playing') {
        return;
      }
      
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
      // Always reset keys to avoid stuck keys
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
      if (gameState !== 'playing' || showNameInput || showLeaderboard) return;
      
      const now = Date.now();
      
      // Shoot when mouse is pressed (allow rapid clicks)
      if (!gameDataRef.current.lastShot || now - gameDataRef.current.lastShot > 200) {
        shootFireball();
        gameDataRef.current.lastShot = now;
      }
      
      // Track mouse hold state
      if (!gameDataRef.current.mouseHeld) {
        gameDataRef.current.mouseHeld = true;
        gameDataRef.current.mouseHoldStart = now;
      }
    };

    const handleMouseUp = () => {
      // Reset mouse state to allow rapid clicking
      if (gameDataRef.current.mouseHeld) {
        gameDataRef.current.mouseHeld = false;
        gameDataRef.current.lastShot = null; // Allow immediate next shot on click
      }
    };

    // Touch handlers for mobile controls
    const handleTouchStart = (e: TouchEvent) => {
      if (gameState !== 'playing' || showNameInput || showLeaderboard || !e.touches[0]) return;
      
      // Get the touch position relative to the canvas
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      // Scale touch coordinates to canvas coordinates (800x600)
      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;
      const scaledTouchX = touchX * scaleX;
      const scaledTouchY = touchY * scaleY;
      
      const player = gameDataRef.current.localPlayer;
      
      // Check if touch is close to player (enlarged touch area for easier dragging)
      const playerCenterX = player.x + 25; // 50/2 = 25 (player size is 50x50)
      const playerCenterY = player.y + 25;
      const touchRadius = 75; // Larger touch area
      
      const isOnPlayer = Math.abs(scaledTouchX - playerCenterX) < touchRadius &&
                         Math.abs(scaledTouchY - playerCenterY) < touchRadius;
      
      if (isOnPlayer) {
        // Start dragging
        isDragging = true;
        lastTouchX = scaledTouchX;
        lastTouchY = scaledTouchY;
      } else {
        // Shoot when tapping outside player area
        if (!gameDataRef.current.lastShot) {
          shootFireball();
          gameDataRef.current.lastShot = Date.now();
        }
      }
      
      // Prevent default to avoid scrolling the page
      e.preventDefault();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (gameState !== 'playing' || showNameInput || showLeaderboard || !e.touches[0]) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      // Scale touch coordinates to canvas coordinates
      const scaleX = 800 / rect.width;
      const scaleY = 600 / rect.height;
      const scaledTouchX = touchX * scaleX;
      const scaledTouchY = touchY * scaleY;
      
      const player = gameDataRef.current.localPlayer;
      
      // More lenient check to start dragging during movement
      if (!isDragging) {
        const playerCenterX = player.x + 25;
        const playerCenterY = player.y + 25;
        const touchRadius = 100; // Even larger area for movement detection
        
        const isNearPlayer = Math.abs(scaledTouchX - playerCenterX) < touchRadius &&
                            Math.abs(scaledTouchY - playerCenterY) < touchRadius;
        if (isNearPlayer) {
          isDragging = true;
          lastTouchX = scaledTouchX;
          lastTouchY = scaledTouchY;
        }
      }
      
      // If we're dragging, move the player directly
      if (isDragging) {
        // Move player to touch position (centered on touch)
        const newX = Math.max(0, Math.min(750, scaledTouchX - 25)); // 750 = 800 - 50 (player width)
        const newY = Math.max(0, Math.min(550, scaledTouchY - 25)); // 550 = 600 - 50 (player height)
        
        player.x = newX;
        player.y = newY;
      }
      
      // Prevent default to avoid scrolling the page
      e.preventDefault();
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (gameState !== 'playing') return;
      isDragging = false;
      
      // Prevent default
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart as EventListener);
    canvas.addEventListener('touchmove', handleTouchMove as EventListener);
    canvas.addEventListener('touchend', handleTouchEnd as EventListener);

    // Store for cleanup
    (window as any).keyHandlers = { handleKeyDown, handleKeyUp };
    (window as any).mouseHandlers = { handleMouseDown, handleMouseUp };
    (window as any).touchHandlers = { handleTouchStart, handleTouchMove, handleTouchEnd };
    console.log('Controls with mouse and touch support set up successfully!');
  };

  // Effect to handle canvas rendering for intro/lobby states
  useEffect(() => {
    if (gameState === 'idle' || gameState === 'ended') {
      console.log('Rendering intro screen for state:', gameState);
      // Small delay to ensure canvas is ready
      setTimeout(() => {
        renderGame();
      }, 100);
    }
  }, [gameState, imagesRef.current.loaded]);

  // Effect to render intro screen on component mount and when images load
  useEffect(() => {
    console.log('Component mounted or images loaded, rendering initial intro screen');
    setTimeout(() => {
      renderGame();
    }, 100);
  }, [imagesRef.current.loaded]);

  // Force render on initial mount
  useEffect(() => {
    console.log('Initial mount - force rendering intro');
    // Force render immediately and after a short delay
    renderGame();
    setTimeout(() => {
      renderGame();
    }, 50);
  }, []);

  // Setup controls when game starts
  useEffect(() => {
    if (gameState === 'playing') {
      console.log('Game is playing, ensuring controls are set up...');
      setupControls();
      
      // Make sure the game loop is running
      if (!(window as any).gameStarted) {
        console.log('Starting game loop for playing state...');
        startGame();
      }
    }
  }, [gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up game...');
      (window as any).gameStarted = false; // Reset game started flag
      if ((window as any).pollInterval) clearInterval((window as any).pollInterval);
      if ((window as any).broadcastInterval) clearInterval((window as any).broadcastInterval);
      if ((window as any).readyTimeout) clearTimeout((window as any).readyTimeout);
      if ((window as any).keyHandlers) {
        window.removeEventListener('keydown', (window as any).keyHandlers.handleKeyDown);
        window.removeEventListener('keyup', (window as any).keyHandlers.handleKeyUp);
      }
      if ((window as any).mouseHandlers && canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', (window as any).mouseHandlers.handleMouseDown);
        canvasRef.current.removeEventListener('mouseup', (window as any).mouseHandlers.handleMouseUp);
      }
      if ((window as any).touchHandlers && canvasRef.current) {
        canvasRef.current.removeEventListener('touchstart', (window as any).touchHandlers.handleTouchStart);
        canvasRef.current.removeEventListener('touchmove', (window as any).touchHandlers.handleTouchMove);
        canvasRef.current.removeEventListener('touchend', (window as any).touchHandlers.handleTouchEnd);
      }
      if (channelRef.current) {
        const supabase = createClient();
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // Player ready up for rematch
  const playerReady = () => {
    if (channelRef.current) {
      setLocalPlayerReady(true);
      
      // Broadcast ready state to opponent
      channelRef.current.send({
        type: 'broadcast',
        event: 'player_ready',
        payload: { userId: user!.id }
      });
    }
  };

  // Check if both players are ready and start game
  useEffect(() => {
    if (rematchAccepted && localPlayerReady && opponentPlayerReady) {
      console.log('Both players ready, starting rematch!');
      
      // Clear any existing ready timeout
      if ((window as any).readyTimeout) {
        clearTimeout((window as any).readyTimeout);
      }
      
      // Start the rematch with a brief countdown
      (window as any).readyTimeout = setTimeout(() => {
        // Double-check states are still valid before starting
        if (rematchAccepted && localPlayerReady && opponentPlayerReady) {
          startNewGame();
        } else {
          console.log('Rematch start aborted - states changed during countdown');
        }
      }, 1000);
    }
  }, [rematchAccepted, localPlayerReady, opponentPlayerReady]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <div className="flex items-center justify-center h-screen">Logging in...</div>;

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* MODERN HEADER */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 50,
          background: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div 
          style={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: '16px 20px',
            maxWidth: '100vw',
            boxSizing: 'border-box',
            minHeight: '70px'
          }}
        >
          {/* Left side - Home Icon + Your Lives */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Link 
              href="/"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8,
                textDecoration: 'none',
                outline: 'none',
                marginRight: '20px'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.opacity = '1';
                target.style.transform = 'scale(1.1)';
                target.style.background = 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.opacity = '0.8';
                target.style.transform = 'scale(1)';
                target.style.background = 'transparent';
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="#000000" 
                stroke="none"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span 
                className="font-sora font-bold"
                style={{
                  color: '#000000',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  marginRight: '8px'
                }}
              >
                YOU:
              </span>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {Array.from({ length: localLives }).map((_, index) => (
                  <div key={index} style={{ width: '24px', height: '24px', marginRight: '4px', display: 'inline-block' }}>
                    <Image 
                      src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                      alt="Your Life"
                      width={24}
                      height={24}
                      unoptimized={true}
                      style={{ display: 'inline-block' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center - PVP Title */}
          <div className="text-center">
            <span 
              className="font-sora font-bold"
              style={{
                color: '#000000',
                fontSize: '22px',
                letterSpacing: '2px'
              }}
            >
              PVP ARENA
            </span>
          </div>
          
          {/* Right side - Opponent Lives + Game Link */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center'
            }}
          >
            {/* Only show opponent lives when game is playing */}
            {gameState === 'playing' && (
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <span 
                  className="font-sora font-bold"
                  style={{
                    color: '#000000',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    marginRight: '8px'
                  }}
                >
                  OPPONENT:
                </span>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {Array.from({ length: opponentLives }).map((_, index) => (
                    <div key={index} style={{ width: '24px', height: '24px', marginRight: '4px', display: 'inline-block' }}>
                      <Image 
                        src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                        alt="Opponent Life"
                        width={24}
                        height={24}
                        unoptimized={true}
                        style={{ display: 'inline-block', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Link 
              href="/game"
              className="font-sora font-bold"
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #d0d0d0',
                borderRadius: '8px',
                color: '#666666',
                fontSize: '14px',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.background = '#f8f8f8';
                target.style.border = '1px solid #c0c0c0';
                target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.background = 'transparent';
                target.style.border = '1px solid #d0d0d0';
                target.style.color = '#666666';
              }}
            >
              SINGLE PLAYER
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div 
        style={{
          marginTop: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          width: '100%',
          height: 'calc(100vh - 80px)',
          boxSizing: 'border-box'
        }}
      >
        {/* Canvas Container */}
        <div 
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
            background: '#ffffff',
            marginBottom: '20px'
          }}
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{
              display: 'block',
              filter: hitEffect ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 0.8))' : 'none',
              opacity: hitEffect ? '0.7' : '1',
              visibility: (gameState === 'queued' || gameState === 'matched') ? 'hidden' : 'visible'
            }}
          />
          
          {hitEffect && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 0, 0, 0.2)',
                pointerEvents: 'none',
                border: '2px solid #ff0000'
              }}
            />
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div 
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              maxWidth: '600px',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '600' }}>{error}</span>
              <button 
                onClick={() => setError(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'rgba(220, 38, 38, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'transparent';
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Game State UI */}

        {gameState === 'queued' && (
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div 
              style={{
                marginBottom: '32px'
              }}
            >
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}
              />
            </div>
            
            <p 
              className="font-sora font-bold"
              style={{
                color: '#000000',
                fontSize: '20px',
                letterSpacing: '1px',
                marginBottom: '32px'
              }}
            >
              SEARCHING FOR OPPONENT...
            </p>
            
            <button
              onClick={() => setGameState('idle')}
              className="font-sora font-bold"
              style={{
                padding: '12px 24px',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '14px',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = '#fecaca';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = '#fee2e2';
              }}
            >
              LEAVE QUEUE
            </button>
          </div>
        )}

        {gameState === 'matched' && (
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <p 
              className="font-sora font-bold"
              style={{
                color: '#059669',
                fontSize: '20px',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}
            >
              MATCH FOUND!
            </p>
            <p 
              style={{
                color: '#666666',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Connecting to battle arena...
            </p>
          </div>
        )}

        {gameState === 'playing' && (
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <p 
              className="font-sora font-bold"
              style={{
                color: '#666666',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}
            >
              WASD to move • SPACEBAR or MOUSE to shoot fireballs
            </p>
          </div>
        )}

        {gameState === 'ended' && (
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ marginBottom: '32px' }}>
              <p 
                className="font-sora font-bold"
                style={{
                  color: winner === 'You' ? '#059669' : '#dc2626',
                  fontSize: '32px',
                  letterSpacing: '2px',
                  marginBottom: '8px'
                }}
              >
                {winner === 'You' ? '🏆 VICTORY!' : '💀 DEFEAT!'}
              </p>
              <p 
                style={{
                  color: '#666666',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                {winner === 'You' 
                  ? 'You dominated the battlefield!' 
                  : 'Better luck next time, warrior!'
                }
              </p>
            </div>
            
            {/* Rematch Request Received */}
            {rematchReceived && (
              <div 
                style={{
                  marginBottom: '24px',
                  padding: '16px',
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#6c757d" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ marginRight: '8px' }}
                  >
                    <path d="M23 4v6h-6"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  <p 
                    className="font-sora font-bold"
                    style={{
                      color: '#495057',
                      fontSize: '16px',
                      letterSpacing: '0.5px',
                      margin: 0
                    }}
                  >
                    Your opponent wants a rematch
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    onClick={acceptRematch}
                    className="font-sora font-bold"
                    style={{
                      padding: '8px 16px',
                      background: '#ffffff',
                      border: '1px solid #d0d7de',
                      borderRadius: '8px',
                      color: '#24292f',
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.background = '#f6f8fa';
                      target.style.borderColor = '#8c959f';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.background = '#ffffff';
                      target.style.borderColor = '#d0d7de';
                    }}
                  >
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ marginRight: '6px' }}
                    >
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Accept
                  </button>
                  <button
                    onClick={() => setRematchReceived(false)}
                    className="font-sora font-bold"
                    style={{
                      padding: '8px 16px',
                      background: '#ffffff',
                      border: '1px solid #d0d7de',
                      borderRadius: '8px',
                      color: '#656d76',
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.background = '#f6f8fa';
                      target.style.borderColor = '#8c959f';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.background = '#ffffff';
                      target.style.borderColor = '#d0d7de';
                    }}
                  >
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ marginRight: '6px' }}
                    >
                      <path d="M18 6 6 18"/>
                      <path d="M6 6l12 12"/>
                    </svg>
                    Decline
                  </button>
                </div>
              </div>
            )}
            
            {/* Rematch Requested */}
            {rematchRequested && !rematchReceived && (
              <div 
                style={{
                  marginBottom: '24px',
                  padding: '16px',
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#6c757d" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ marginRight: '8px' }}
                  >
                    <path d="M23 4v6h-6"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  <p 
                    className="font-sora font-bold"
                    style={{
                      color: '#495057',
                      fontSize: '16px',
                      letterSpacing: '0.5px',
                      margin: 0
                    }}
                  >
                    Rematch requested! Waiting for opponent...
                  </p>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              {/* Rematch Button (only show if no request pending) */}
              {!rematchRequested && !rematchReceived && (
                <button
                  onClick={requestRematch}
                  className="font-sora font-bold"
                  style={{
                    padding: '12px 24px',
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    color: '#000000',
                    fontSize: '16px',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    outline: 'none',
                    width: '100%',
                    maxWidth: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.background = '#f8f8f8';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.background = '#ffffff';
                  }}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ marginRight: '8px' }}
                  >
                    <path d="M23 4v6h-6"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  Request Rematch
                </button>
              )}
              
              <button
                onClick={() => {
                  setGameState('idle');
                  setWinner(null);
                  setMatchId(null);
                  // Reset rematch states
                  setRematchRequested(false);
                  setRematchReceived(false);
                  setRematchAccepted(false);
                  setLocalPlayerReady(false);
                  setOpponentPlayerReady(false);
                  // Reset leaderboard states
                  setShowNameInput(false);
                  setPlayerName('');
                  // Reset lives
                  setLocalLives(4);
                  setOpponentLives(4);
                  // Reset game data
                  gameDataRef.current.fireballs = [];
                  gameDataRef.current.explosions = [];
                  gameDataRef.current.localPlayer.health = 100;
                  gameDataRef.current.localPlayer.lives = 4;
                  gameDataRef.current.opponentPlayer.health = 100;
                  gameDataRef.current.opponentPlayer.lives = 4;
                }}
                className="font-sora font-bold"
                style={{
                  padding: '12px 24px',
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  color: '#000000',
                  fontSize: '16px',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  outline: 'none',
                  width: '100%',
                  maxWidth: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#f8f8f8';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#ffffff';
                }}
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ marginRight: '8px' }}
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                Find New Opponent
              </button>
              
              <button
                onClick={() => setShowLeaderboard(true)}
                className="font-sora font-bold"
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  color: '#666666',
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  outline: 'none',
                  width: '100%',
                  maxWidth: '300px'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#f8f8f8';
                  target.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = 'transparent';
                  target.style.color = '#666666';
                }}
              >
                🏆 VIEW LEADERBOARD
              </button>
            </div>
          </div>
        )}

        {/* Rematch Ready Phase */}
        {rematchAccepted && !localPlayerReady && (
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div 
              style={{
                marginBottom: '32px'
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                alt="Character"
                width={80}
                height={80}
                style={{ 
                  objectFit: 'contain',
                  opacity: 1,
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>
            
            <h2 
              className="font-sora font-bold"
              style={{
                color: '#000000',
                fontSize: '20px',
                letterSpacing: '1px',
                marginBottom: '16px'
              }}
            >
              Rematch Accepted!
            </h2>
            
            <p 
              style={{
                color: '#666666',
                fontSize: '14px',
                marginBottom: '24px'
              }}
            >
              Click ready when you're prepared to battle
            </p>
            
            <button
              onClick={playerReady}
              className="font-sora font-bold"
              style={{
                padding: '16px 32px',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                color: '#000000',
                fontSize: '18px',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '16px',
                width: '100%',
                maxWidth: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-1px)';
                target.style.background = '#f8f8f8';
                target.style.border = '1px solid #d0d0d0';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.background = '#ffffff';
                target.style.border = '1px solid #e0e0e0';
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginRight: '8px' }}
              >
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              Ready for Battle
            </button>
          </div>
        )}

        {/* Waiting for Opponent to Ready */}
        {rematchAccepted && localPlayerReady && !opponentPlayerReady && (
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div 
              style={{
                marginBottom: '32px'
              }}
            >
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}
              />
            </div>
            
            <h2 
              className="font-sora font-bold"
              style={{
                color: '#000000',
                fontSize: '20px',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}
            >
              You're Ready!
            </h2>
            
            <p 
              style={{
                color: '#666666',
                fontSize: '14px'
              }}
            >
              Waiting for opponent to ready up...
            </p>
          </div>
        )}

        {gameState === 'idle' && !rematchAccepted && (
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div 
              style={{
                marginBottom: '32px'
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                alt="Character"
                width={80}
                height={80}
                style={{ 
                  objectFit: 'contain',
                  opacity: 1,
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>
            
            <button
              onClick={joinQueue}
              className="font-sora font-bold"
              style={{
                padding: '16px 32px',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                color: '#000000',
                fontSize: '18px',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                outline: 'none',
                marginBottom: '16px',
                width: '100%',
                maxWidth: '300px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-1px)';
                target.style.background = '#f8f8f8';
                target.style.border = '1px solid #d0d0d0';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.background = '#ffffff';
                target.style.border = '1px solid #e0e0e0';
              }}
            >
              JOIN PVP MATCH
            </button>
            
            <button
              onClick={() => setShowLeaderboard(true)}
              className="font-sora font-bold"
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid #d0d0d0',
                borderRadius: '8px',
                color: '#666666',
                fontSize: '14px',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                outline: 'none',
                width: '100%',
                maxWidth: '300px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-1px)';
                target.style.background = '#f8f8f8';
                target.style.border = '1px solid #c0c0c0';
                target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0)';
                target.style.background = 'transparent';
                target.style.border = '1px solid #d0d0d0';
                target.style.color = '#666666';
              }}
            >
              PVP LEADERBOARD
            </button>
          </div>
        )}
      </div>

      {/* Left Sidebar - Clean Minimalistic Controls */}
      {!isMobile && (
        <div 
          className="pvp-sidebar-left"
          style={{
            position: 'fixed',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 40,
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '20px 16px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '200px'
          }}
        >
        <div style={{ marginBottom: '24px' }}>
          <h3 
            style={{
              color: '#000000',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}
          >
            MOBILE
          </h3>
          <p 
            style={{
              color: '#666666',
              fontSize: '12px',
              lineHeight: '1.4',
              margin: 0
            }}
          >
            Drag to move<br/>
            Tap to shoot
          </p>
        </div>
        
        <div>
          <h3 
            style={{
              color: '#000000',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}
          >
            DESKTOP
          </h3>
          <p 
            style={{
              color: '#666666',
              fontSize: '12px',
              lineHeight: '1.4',
              margin: 0
            }}
          >
            WASD to move<br/>
            Spacebar or Mouse to shoot
          </p>
        </div>
        </div>
      )}

      {/* Right Sidebar - Wins */}
      {!isMobile && (
        <div 
          className="pvp-sidebar-right"
          style={{
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 40,
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px 12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '120px',
            textAlign: 'center'
          }}
        >
        <div>
          <h3 
            style={{
              color: '#000000',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}
          >
            WINS
          </h3>
          <p 
            style={{
              color: '#DC2626',
              fontSize: '20px',
              fontWeight: '900',
              margin: 0
            }}
          >
            {userWins}
          </p>
        </div>
        </div>
      )}



      {/* Loading Spinner Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* PVP Leaderboard Modal */}
      {showLeaderboard && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            cursor: 'pointer'
          }}
          onClick={() => setShowLeaderboard(false)}
        >
          <div 
            style={{
              background: '#f5f5f5',
              borderRadius: '12px',
              padding: '32px',
              minWidth: '400px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflow: 'auto',
              border: '1px solid #e0e0e0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: '32px',
                marginBottom: '12px'
              }}
            >
              🏆
            </div>
            
            <h2 
              style={{
                color: '#000000',
                fontSize: '24px',
                fontWeight: '900',
                letterSpacing: '1px',
                marginBottom: '24px',
                textAlign: 'center'
              }}
            >
              PVP LEADERBOARD
            </h2>
            
            {leaderboard.length === 0 ? (
              <p 
                style={{
                  color: '#666666',
                  fontSize: '14px',
                  textAlign: 'center',
                  padding: '40px 0'
                }}
              >
                No PVP champions yet. Be the first to win!
              </p>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                {leaderboard.map((entry, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      marginBottom: '8px',
                      background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span 
                        style={{
                          color: index < 3 ? '#000000' : '#666666',
                          fontSize: '18px',
                          fontWeight: '900',
                          marginRight: '16px',
                          minWidth: '30px'
                        }}
                      >
                        #{index + 1}
                      </span>
                      <span 
                        style={{
                          color: '#000000',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}
                      >
                        {entry.player_name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span 
                        style={{
                          color: '#DC2626',
                          fontSize: '18px',
                          fontWeight: '900',
                          marginRight: '8px'
                        }}
                      >
                        {entry.wins}
                      </span>
                      <span 
                        style={{
                          color: '#666666',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        {entry.wins === 1 ? 'win' : 'wins'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setShowLeaderboard(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                color: '#000000',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = '#f8f8f8';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = '#ffffff';
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Winner Name Input Modal */}
      {showNameInput && winner === 'You' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 300
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            style={{
              background: '#f5f5f5',
              borderRadius: '8px',
              padding: '24px',
              minWidth: '300px',
              maxWidth: '90vw',
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: '32px',
                marginBottom: '12px'
              }}
            >
              🏆
            </div>
            
            <h2 
              className="font-sora font-bold"
              style={{
                color: '#000000',
                fontSize: '18px',
                marginBottom: '8px',
                textAlign: 'center',
                letterSpacing: '0.5px'
              }}
            >
              VICTORY!
            </h2>
            
            <p 
              style={{
                color: '#DC2626',
                fontSize: '16px',
                fontWeight: '900',
                textAlign: 'center',
                marginBottom: '20px'
              }}
            >
              You defeated your opponent!
            </p>
            
            <input
              type="text"
              placeholder="Enter your name for leaderboard"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid #d0d0d0',
                marginBottom: '16px',
                outline: 'none',
                background: '#ffffff',
                color: '#000000',
                boxSizing: 'border-box',
                zIndex: '400'
              }}
              onKeyDown={(e) => {
                e.stopPropagation(); // Prevent game controls from interfering
                if (e.key === 'Enter') {
                  e.preventDefault();
                  saveWinToLeaderboard(playerName || 'Anonymous').then(() => {
                    setShowNameInput(false);
                    setPlayerName('');
                  });
                }
              }}
              onFocus={(e) => e.target.select()}
              autoFocus
            />
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  saveWinToLeaderboard(playerName || 'Anonymous').then(() => {
                    setShowNameInput(false);
                    setPlayerName('');
                  });
                }}
                className="font-sora font-bold"
                style={{
                  padding: '12px 20px',
                  background: '#dcfce7',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  color: '#059669',
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flex: 1,
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#bbf7d0';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#dcfce7';
                }}
              >
                🏆 SAVE TO LEADERBOARD
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNameInput(false);
                  setPlayerName('');
                }}
                className="font-sora font-bold"
                style={{
                  padding: '12px 16px',
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#fecaca';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#fee2e2';
                }}
              >
                SKIP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Plaintext Footer - Bottom Left */}
      <div 
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          zIndex: 30,
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#666666',
          letterSpacing: '0.5px',
          lineHeight: '1.2',
          userSelect: 'none',
          pointerEvents: 'auto'
        }}
      >
        <span style={{ color: '#000000', fontWeight: '600' }}>🔫 AMMOCAT</span>
        <span style={{ color: '#999999', margin: '0 4px' }}>→</span>
        <a 
          href="/game" 
          style={{ 
            color: '#666666', 
            textDecoration: 'none', 
            cursor: 'pointer',
            padding: '1px 2px',
            borderRadius: '2px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = '#000000';
            target.style.background = 'rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = '#666666';
            target.style.background = 'transparent';
          }}
        >
          PLAY
        </a>
        <span style={{ color: '#999999', margin: '0 4px' }}>|</span>
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); window.location.href = '/?view=shop'; }}
          style={{ 
            color: '#666666', 
            textDecoration: 'none', 
            cursor: 'pointer',
            padding: '1px 2px',
            borderRadius: '2px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = '#000000';
            target.style.background = 'rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.color = '#666666';
            target.style.background = 'transparent';
          }}
        >
          SHOP
        </a>
        <span style={{ color: '#999999', margin: '0 4px' }}>|</span>
        <span style={{ color: '#000000', fontWeight: '600', background: 'rgba(0, 0, 0, 0.05)', padding: '1px 4px', borderRadius: '2px' }}>PVP</span>
        <span style={{ color: '#cccccc', margin: '0 8px', fontSize: '10px' }}>
          ──────────────
        </span>
        <a 
          href="https://ammocat3000.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none', 
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.transform = 'scale(1)';
          }}
        >
          🌙
        </a>
      </div>

      {/* Feedback Button */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <Link href="/feedback" style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              color: '#333333',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            Feedback
          </button>
        </Link>
      </div>
    </div>
  );
} 