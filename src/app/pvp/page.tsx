'use client';

import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createClient } from '../../lib/supabase';
import { usePvpGameState } from './usePvpGameState';
import Image from 'next/image';
import Link from 'next/link';

export default function PvpPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user, loading } = useAuth();
  const [queueStatus, setQueueStatus] = useState<'idle' | 'queuing' | 'queued' | 'matched'>('idle');
  const [matchId, setMatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const isPlayer1 = matchData ? user!.id === matchData.player1_id : false;
  const [bothReady, setBothReady] = useState(false);
  const readyCountRef = useRef(0);
  const channelRef = useRef<any>(null);
  const game = usePvpGameState(isPlayer1, channelRef.current);
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [pvpLeaderboard, setPvpLeaderboard] = useState<{ name: string; wins: number; games: number }[]>([]);
  const [showPvpLeaderboard, setShowPvpLeaderboard] = useState(false);
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  const PLAYER_SIZE = 64;
  const FIREBALL_SIZE = 20;
  const POWERUP_SIZE = 32;
  const [lastLocalAngle, setLastLocalAngle] = useState(0);
  const opponentLastAngleRef = useRef(0);
  const [opponentName, setOpponentName] = useState('Opponent');
  const [localName, setLocalName] = useState(user?.email?.split('@')[0] || 'You');
  const shootSound = useRef<HTMLAudioElement | null>(null);
  const hitSound = useRef<HTMLAudioElement | null>(null);
  const pickupSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);
  const [pvpLeaderboardError, setPvpLeaderboardError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    shootSound.current = new Audio('/sounds/shoot.mp3');
    hitSound.current = new Audio('/sounds/hit.mp3');
    pickupSound.current = new Audio('/sounds/pickup.mp3');
    winSound.current = new Audio('/sounds/win.mp3');
    loseSound.current = new Audio('/sounds/lose.mp3');

    // Preload
    shootSound.current?.load();
    hitSound.current?.load();
    pickupSound.current?.load();
    winSound.current?.load();
    loseSound.current?.load();
  }, []);

  // Polling for match status
  useEffect(() => {
    if (queueStatus !== 'queued') return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/pvp/queue');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check queue');
        }

        if (data.status === 'matched') {
          setQueueStatus('matched');
          setMatchId(data.match.id);
          setMatchData(data.match); // Set match data
          clearInterval(interval);
        }
      } catch (err: unknown) {
        console.error('Polling error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [queueStatus]);

  // Set match data when matched
  useEffect(() => {
    if (queueStatus === 'matched' && matchId) {
      // Fetch full match data if needed, but for now assume we have it
      // Actually, from polling/join, we have data.match
      // But to simplify, let's refetch or use state
      // Wait, update joinQueue and polling to setMatchData
    }
  }, [queueStatus, matchId]);

  // Fetch PVP leaderboard
  useEffect(() => {
    fetch('/api/pvp/leaderboard')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        return res.json();
      })
      .then(setPvpLeaderboard)
      .catch((err) => {
        console.error(err);
        setPvpLeaderboardError('Failed to load leaderboard');
      });
  }, []);

  // Fetch opponent name when matched
  useEffect(() => {
    if (matchData) {
      const supabase = createClient();
      const oppId = isPlayer1 ? matchData.player2_id : matchData.player1_id;
      supabase.auth.admin.getUserById(oppId).then(({ data }) => {
        if (data.user) setOpponentName(data.user.email?.split('@')[0] || 'Guest');
      });
    }
  }, [matchData, isPlayer1]);

  // Realtime setup
  useEffect(() => {
    if (queueStatus !== 'matched' || !matchId || !user) return;

    const supabase = createClient();
    const channel = supabase.channel(`pvp:${matchId}`);

    channel
      .on('broadcast', { event: 'player_update' }, ({ payload }) => {
        console.log('Received player_update:', payload);
        if (payload.userId !== user!.id) {
          game.opponentPlayerRef.current = { ...game.opponentPlayerRef.current, ...payload.state };
          opponentLastAngleRef.current = payload.state.lastAngle || 0;
        }
      })
      .on('broadcast', { event: 'shoot' }, ({ payload }) => {
        console.log('Received shoot:', payload);
        if (payload.userId !== user!.id) {
          game.fireballsRef.current.push({ ...payload.fireball, owner: 'opponent' });
          shootSound.current?.play().catch(() => {});
        }
      })
      .on('broadcast', { event: 'ready' }, ({ payload }) => {
        console.log('Received ready:', payload);
        readyCountRef.current++;
        if (readyCountRef.current >= 2) {
          setBothReady(true);
          game.startGame();
        }
      })
      .on('broadcast', { event: 'powerup_spawn' }, ({ payload }) => {
        console.log('Received powerup_spawn:', payload);
        game.powerUpsRef.current.push(payload.powerUp);
      })
      .on('broadcast', { event: 'powerup_pickup' }, ({ payload }) => {
        console.log('Received powerup_pickup:', payload);
        game.powerUpsRef.current = game.powerUpsRef.current.filter(pu => pu.id !== payload.powerUpId);
        pickupSound.current?.play().catch(() => {});
      })
      .on('presence', { event: 'leave' }, () => {
        console.log('Opponent left');
        if (game.gameStatus === 'playing') {
          game.endGame('local'); // Award win to local
          if (matchId && user) {
            fetch(`/api/pvp/match/${matchId}/update`, {
              method: 'POST',
              body: JSON.stringify({ winner_id: user!.id }),
            }).catch(console.error);
          }
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online: true });
          channelRef.current = channel;
          channel.send({ type: 'broadcast', event: 'ready', payload: { userId: user!.id } });
        }
      });

    // Broadcast loop
    const interval = setInterval(() => {
      if (game.gameStatus === 'playing') {
        channel.send({
          type: 'broadcast',
          event: 'player_update',
          payload: { userId: user!.id, state: { ...game.localPlayerRef.current, lastAngle: lastLocalAngle } },
        });
      }
    }, 50);

    return () => {
      if (supabase && channelRef.current) supabase.removeChannel(channelRef.current);
      clearInterval(interval);
      channelRef.current = null;
    };
  }, [queueStatus, matchId, user, game]);

  // Input handlers
  useEffect(() => {
    if (game.gameStatus !== 'playing') return;

    const local = game.localPlayerRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': local.isMovingUp = true; break;
        case 's': local.isMovingDown = true; break;
        case 'a': local.isMovingLeft = true; break;
        case 'd': local.isMovingRight = true; break;
        case ' ': 
          const opp = game.opponentPlayerRef.current;
          const angle = Math.atan2(opp.y - local.y, opp.x - local.x);
          game.shootFireball(angle);
          if (channelRef.current) {
            const supabase = createClient();
            supabase.channel(`pvp:${matchId}`).send({
              type: 'broadcast',
              event: 'shoot',
              payload: {
                userId: user!.id,
                fireball: {
                  ...game.fireballsRef.current[game.fireballsRef.current.length - 1]
                }
              }
            });
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': local.isMovingUp = false; break;
        case 's': local.isMovingDown = false; break;
        case 'a': local.isMovingLeft = false; break;
        case 'd': local.isMovingRight = false; break;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mousePosRef.current.x = e.clientX - rect.left;
      mousePosRef.current.y = e.clientY - rect.top;
    };

    const handleMouseDown = () => {
      const dx = mousePosRef.current.x - (local.x + 32);
      const dy = mousePosRef.current.y - (local.y + 32);
      const angle = Math.atan2(dy, dx);
      setLastLocalAngle(angle);
      game.shootFireball(angle);
      if (channelRef.current) {
        const supabase = createClient();
        supabase.channel(`pvp:${matchId}`).send({
          type: 'broadcast',
          event: 'shoot',
          payload: { userId: user!.id, fireball: game.fireballsRef.current[game.fireballsRef.current.length - 1] }
        });
      }
      shootSound.current?.play().catch(() => {});
    };

    const handleMouseUp = () => {
      // Optional: for continuous shooting if needed
    };

    // Touch controls
    const joystickRef = useRef({ active: false, startX: 0, startY: 0 });

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0 || !canvasRef.current) return;
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      if (touchX < GAME_WIDTH / 2) {
        // Left side: move
        joystickRef.current = { active: true, startX: touchX, startY: touchY };
      } else {
        // Right side: shoot towards touch
        const dx = touchX - (local.x + 32);
        const dy = touchY - (local.y + 32);
        const angle = Math.atan2(dy, dx);
        setLastLocalAngle(angle);
        game.shootFireball(angle);
        if (channelRef.current) {
          const supabase = createClient();
          supabase.channel(`pvp:${matchId}`).send({
            type: 'broadcast',
            event: 'shoot',
            payload: { userId: user!.id, fireball: game.fireballsRef.current[game.fireballsRef.current.length - 1] }
          });
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!joystickRef.current.active || e.touches.length === 0 || !canvasRef.current) return;
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      const dx = touchX - joystickRef.current.startX;
      const dy = touchY - joystickRef.current.startY;
      const dist = Math.hypot(dx, dy);
      if (dist > 20) {
        const angle = Math.atan2(dy, dx);
        local.x += Math.cos(angle) * local.speed;
        local.y += Math.sin(angle) * local.speed;
        local.x = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, local.x));
        local.y = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, local.y));
      }
    };

    const handleTouchEnd = () => {
      joystickRef.current.active = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvasRef.current?.addEventListener('mousemove', handleMouseMove);
    canvasRef.current?.addEventListener('mousedown', handleMouseDown);
    canvasRef.current?.addEventListener('mouseup', handleMouseUp);
    canvasRef.current?.addEventListener('touchstart', handleTouchStart);
    canvasRef.current?.addEventListener('touchmove', handleTouchMove);
    canvasRef.current?.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown);
      canvasRef.current?.removeEventListener('mouseup', handleMouseUp);
      canvasRef.current?.removeEventListener('touchstart', handleTouchStart);
      canvasRef.current?.removeEventListener('touchmove', handleTouchMove);
      canvasRef.current?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [game, channelRef, matchId, user]);

  // For speed boost timeout
  useEffect(() => {
    if (game.localPlayerRef.current.speed > 5) {
      const timeout = setTimeout(() => { game.localPlayerRef.current.speed = 5; }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [game.localPlayerRef.current.speed]);

  // Game loop
  useEffect(() => {
    if (game.gameStatus !== 'playing' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (typeof window === 'undefined') return;

    // Load images
    const playerImage = new window.Image();
    playerImage.src = 'https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png';

    const healthImage = new window.Image();
    healthImage.src = 'https://example.com/heart.png'; // Replace with actual URL
    const speedImage = new window.Image();
    speedImage.src = 'https://example.com/bolt.png'; // Replace with actual URL

    const update = () => {
      // Clear
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw local player with dynamic flip
      if (playerImage.complete) {
        ctx.save();
        ctx.translate(game.localPlayerRef.current.x + 32, game.localPlayerRef.current.y + 32);
        if (Math.cos(lastLocalAngle) < 0) ctx.scale(-1, 1);
        ctx.drawImage(playerImage, -32, -32, PLAYER_SIZE, PLAYER_SIZE);
        ctx.restore();
      }

      // Draw opponent with dynamic flip
      if (playerImage.complete) {
        ctx.save();
        ctx.translate(game.opponentPlayerRef.current.x + 32, game.opponentPlayerRef.current.y + 32);
        if (Math.cos(opponentLastAngleRef.current) < 0) ctx.scale(-1, 1);
        ctx.drawImage(playerImage, -32, -32, PLAYER_SIZE, PLAYER_SIZE);
        ctx.restore();
      }

      // Draw fireballs
      game.fireballsRef.current.forEach(fb => {
        ctx.fillStyle = fb.owner === 'local' ? '#FF0000' : '#0000FF';
        ctx.beginPath();
        ctx.arc(fb.x, fb.y, FIREBALL_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw powerups with images
      game.powerUpsRef.current.forEach(pu => {
        const img = pu.type === 'health' ? healthImage : speedImage;
        if (img.complete) {
          ctx.drawImage(img, pu.x, pu.y, POWERUP_SIZE, POWERUP_SIZE);
        } else {
          // Fallback drawing if image not loaded
          ctx.fillStyle = pu.type === 'health' ? '#00FF00' : '#FFFF00';
          ctx.fillRect(pu.x, pu.y, POWERUP_SIZE, POWERUP_SIZE);
        }
      });

      // Draw health bars
      // Local
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(10, 10, 200 * (game.localPlayerRef.current.health / 100), 20);
      // Opponent
      ctx.fillRect(GAME_WIDTH - 210, 10, 200 * (game.opponentPlayerRef.current.health / 100), 20);

      // Draw player names
      ctx.font = '16px Arial';
      ctx.fillStyle = '#000000';
      ctx.fillText(localName, 10, 50);
      ctx.fillText(opponentName, GAME_WIDTH - 100, 50);

      // Update local position
      const local = game.localPlayerRef.current;
      if (local.isMovingUp) local.y = Math.max(0, local.y - local.speed);
      if (local.isMovingDown) local.y = Math.min(GAME_HEIGHT - PLAYER_SIZE, local.y + local.speed);
      if (local.isMovingLeft) local.x = Math.max(0, local.x - local.speed);
      if (local.isMovingRight) local.x = Math.min(GAME_WIDTH - PLAYER_SIZE, local.x + local.speed);

      // Update fireballs
      game.fireballsRef.current = game.fireballsRef.current.filter(fb => {
        fb.x += Math.cos(fb.angle) * fb.speed;
        fb.y += Math.sin(fb.angle) * fb.speed;

        if (fb.owner === 'opponent' && Math.hypot(fb.x - (local.x + 32), fb.y - (local.y + 32)) < 40) {
          game.updateHealth('local', -20);
          hitSound.current?.play().catch(() => {});
          return false;
        }

        return fb.x >= 0 && fb.x <= GAME_WIDTH && fb.y >= 0 && fb.y <= GAME_HEIGHT;
      });

      // Check powerup pickup
      game.powerUpsRef.current = game.powerUpsRef.current.filter(pu => {
        if (Math.hypot(pu.x - (local.x + 32), pu.y - (local.y + 32)) < 40) {
          if (pu.type === 'health') game.updateHealth('local', 20);
          if (pu.type === 'speed') local.speed += 2;
          if (channelRef.current) {
            const supabase = createClient();
            supabase.channel(`pvp:${matchId}`).send({ type: 'broadcast', event: 'powerup_pickup', payload: { powerUpId: pu.id } });
          }
          pickupSound.current?.play().catch(() => {});
          return false;
        }
        return true;
      });

      requestAnimationFrame(update);
    };

    playerImage.onload = () => requestAnimationFrame(update);
    // Or start update immediately and check complete inside
    update();
  }, [game.gameStatus, channelRef, lastLocalAngle, opponentLastAngleRef, game]);

  // Update match on end
  useEffect(() => {
    if (game.gameStatus === 'ended' && game.winner && matchId && user && !user!.is_anonymous) {
      const winnerId = game.winner === 'local' ? user!.id : (isPlayer1 ? matchData.player2_id : matchData.player1_id);
      fetch(`/api/pvp/match/${matchId}/update`, {
        method: 'POST',
        body: JSON.stringify({ winner_id: winnerId }),
      }).catch(console.error);
    }
  }, [game.gameStatus, game.winner, matchId, user, isPlayer1, matchData]);

  // Play win/lose sound
  useEffect(() => {
    if (game.gameStatus === 'ended') {
      if (game.winner === 'local') winSound.current?.play().catch(() => {});
      else loseSound.current?.play().catch(() => {});
    }
  }, [game.gameStatus, game.winner]);

  const joinQueue = async () => {
    setQueueStatus('queuing');
    setError(null);

    try {
      const response = await fetch('/api/pvp/queue', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join queue');
      }

      if (data.message === 'Matched') {
        setQueueStatus('matched');
        setMatchId(data.match.id);
        setMatchData(data.match); // Set match data
      } else {
        setQueueStatus('queued');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setQueueStatus('idle');
    }
  };

  const leaveQueue = async () => {
    try {
      const response = await fetch('/api/pvp/queue', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to leave queue');
      setQueueStatus('idle');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error leaving queue');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShowMobileOverlay(window.innerWidth < 768);
    }
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl mb-4">Logging in anonymously...</p>
      </div>
    );
  }

  // Update realtime subscriptions
  // Add .on('broadcast', { event: 'health_update' }, ({ payload }) => {
  //   if (payload.userId !== user.id) game.opponentPlayerRef.current.health = payload.health;
  // })
  // .on('broadcast', { event: 'powerup_spawn' }, ({ payload }) => {
  //   game.powerUpsRef.current.push(payload.powerUp);
  // })
  // .on('broadcast', { event: 'powerup_pickup' }, ({ payload }) => {
  //   game.powerUpsRef.current = game.powerUpsRef.current.filter(pu => pu.id !== payload.powerUpId);
  // })
  // For ready: readyCountRef.current++;
  // if (readyCountRef.current === 2) setBothReady(true); game.startGame();

  // In spawnPowerUp of hook, if (isPlayer1) broadcast

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl mb-8">Ammo Cat PVP</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="bg-white mb-4"
      />
      {error && (
        <div className="fixed top-20 bg-red-500 p-4 rounded-lg text-white">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-sm">Close</button>
        </div>
      )}
      {showMobileOverlay && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-black">
            <p className="text-xl mb-4">Mobile Controls:</p>
            <p>Drag on screen to move</p>
            <p>Double-tap to shoot</p>
            <button onClick={() => setShowMobileOverlay(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Got it!</button>
          </div>
        </div>
      )}
      {queueStatus === 'idle' && (
        <div className="flex">
          <button
            onClick={joinQueue}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl"
          >
            Join Queue
          </button>
          <button
            onClick={() => setShowPvpLeaderboard(true)}
            className="ml-4 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-xl"
          >
            Leaderboard
          </button>
        </div>
      )}
      {queueStatus === 'queuing' && <p className="text-xl">Joining queue...</p>}
      {queueStatus === 'queued' && (
        <div>
          <p className="text-xl">Waiting for opponent...</p>
          <button
            onClick={leaveQueue}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-xl mt-4"
          >
            Leave Queue
          </button>
        </div>
      )}
      {queueStatus === 'matched' && (
        <div>
          <p className="text-xl text-green-500">Match Found! You are {isPlayer1 ? 'Player 1' : 'Player 2'}</p>
          {game.gameStatus === 'playing' && <p>Game in progress</p>}
          {game.gameStatus === 'ended' && <p>Winner: {game.winner}</p>}
        </div>
      )}
      {queueStatus === 'matched' && !bothReady && <p>Waiting for opponent to ready...</p>}
      {game.gameStatus === 'ended' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-center">
            <p className="text-6xl font-bold mb-4">{game.winner === 'local' ? 'You Win!' : 'You Lose!'}</p>
            <button
              onClick={joinQueue}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl"
            >
              Rematch
            </button>
          </div>
        </div>
      )}
      {user.is_anonymous && (
        <p className="text-sm text-yellow-300 mb-4">Playing as guest - log in for stats: <Link href="/login">Login</Link></p>
      )}
      {showPvpLeaderboard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowPvpLeaderboard(false)}>
          <div className="bg-white p-6 rounded-lg text-black max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl mb-4">PVP Leaderboard</h2>
            {pvpLeaderboardError ? (
              <p className="text-red-500">{pvpLeaderboardError}</p>
            ) : pvpLeaderboard.length === 0 ? (
              <p>No entries yet.</p>
            ) : (
              <ul>
                {pvpLeaderboard.map((entry, index) => (
                  <li key={index} className="flex justify-between mb-2">
                    <span>#{index + 1} {entry.name}</span>
                    <span>{entry.wins} wins ({entry.games} games)</span>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowPvpLeaderboard(false)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
      {queueStatus === 'matched' && game.gameStatus === 'playing' && (
        <button
          onClick={leaveQueue}
          className="absolute top-4 right-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-lg"
        >
          Quit
        </button>
      )}
    </div>
  );
} 