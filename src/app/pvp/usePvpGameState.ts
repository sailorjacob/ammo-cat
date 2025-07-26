import { useRef, useState, useEffect } from 'react';

export interface Fireball {
  id: number;
  x: number;
  y: number;
  speed: number;
  angle: number;
  owner: 'local' | 'opponent';
}

export interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: 'health' | 'speed';
}

export interface Player {
  x: number;
  y: number;
  health: number;
  speed: number;
  isMovingUp: boolean;
  isMovingDown: boolean;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  isShooting: boolean;
}

export const usePvpGameState = (isPlayer1: boolean) => {
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'ended'>('waiting');
  const [winner, setWinner] = useState<'local' | 'opponent' | null>(null);
  
  // Remove channel tracking since it was causing React hooks issues
  // The main component will handle channel communication directly

  const localPlayerRef = useRef<Player>({
    x: isPlayer1 ? 100 : 700, // Player1 left, Player2 right
    y: 250,
    health: 100,
    speed: 5,
    isMovingUp: false,
    isMovingDown: false,
    isMovingLeft: false,
    isMovingRight: false,
    isShooting: false,
  });

  const opponentPlayerRef = useRef<Player>({
    x: isPlayer1 ? 700 : 100,
    y: 250,
    health: 100,
    speed: 5,
    isMovingUp: false,
    isMovingDown: false,
    isMovingLeft: false,
    isMovingRight: false,
    isShooting: false,
  });

  const fireballsRef = useRef<Fireball[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const nextIdRef = useRef(1);

  const startGame = () => {
    setGameStatus('playing');
    // TODO: Integrate realtime sync
  };

  const endGame = (winner: 'local' | 'opponent') => {
    setGameStatus('ended');
    setWinner(winner);
  };

  const updateHealth = (player: 'local' | 'opponent', delta: number) => {
    const ref = player === 'local' ? localPlayerRef : opponentPlayerRef;
    ref.current.health = Math.max(0, ref.current.health + delta);
    if (ref.current.health <= 0) {
      endGame(player === 'local' ? 'opponent' : 'local');
    }
  };

  const shootFireball = (angle?: number) => {
    const player = localPlayerRef.current;
    const defaultAngle = isPlayer1 ? 0 : Math.PI;
    const shootAngle = angle ?? defaultAngle;
    const centerX = player.x + 32;
    const centerY = player.y + 32;
    const offset = 32;
    fireballsRef.current.push({
      id: nextIdRef.current++,
      x: centerX + Math.cos(shootAngle) * offset,
      y: centerY + Math.sin(shootAngle) * offset,
      speed: 7,
      angle: shootAngle,
      owner: 'local',
    });
  };

  const spawnPowerUp = () => {
    const newPu: PowerUp = {
      id: nextIdRef.current++,
      x: Math.random() * 800,
      y: Math.random() * 600,
      type: Math.random() < 0.5 ? 'health' : 'speed',
    };
    powerUpsRef.current.push(newPu);
    // Removed channel communication as per edit hint
  };

  // Spawn power-ups every 10-20s - removed channel from dependencies
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(spawnPowerUp, Math.random() * 10000 + 10000);
    return () => clearInterval(interval);
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const checkWinInterval = setInterval(() => {
      if (localPlayerRef.current.health <= 0) {
        endGame('opponent');
      }
      if (opponentPlayerRef.current.health <= 0) {
        endGame('local');
      }
    }, 100); // Check every 100ms
    return () => clearInterval(checkWinInterval);
  }, [gameStatus]);

  return {
    gameStatus,
    winner,
    localPlayerRef,
    opponentPlayerRef,
    fireballsRef,
    powerUpsRef,
    startGame,
    endGame,
    updateHealth,
    shootFireball,
    // Add more functions as needed
  };
}; 