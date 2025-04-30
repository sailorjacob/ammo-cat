import { useRef, useState } from 'react';

export interface Zombie {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  lastFireTime: number;
  fireRate: number;
}

export interface Fireball {
  x: number;
  y: number;
  angle?: number;
  curve?: number;
  speed: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  fireballs: Fireball[];
  isMovingUp: boolean;
  isMovingDown: boolean;
  isMovingLeft: boolean;
  isMovingRight: boolean;
  isShooting: boolean;
}

interface GameState {
  zombies: Zombie[];
  enemyFireballs: Fireball[];
  zombiesKilled: number;
  currentWaveSize: number;
  nextZombieId: number;
  debug: boolean;
}

export const useGameState = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(4);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'countdown' | 'gameover'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [finalScore, setFinalScore] = useState(0);
  const [hitEffect, setHitEffect] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(0);
  
  // Player reference to maintain position between renders
  const playerRef = useRef<Player | null>(null);
  
  // Game state reference
  const gameStateRef = useRef<GameState>({
    zombies: [],
    enemyFireballs: [],
    zombiesKilled: 0,
    currentWaveSize: 1,
    nextZombieId: 1,
    debug: true  // Enable debug logging
  });
  
  // Initialize player position
  const initializePlayer = (width: number, height: number) => {
    const PLAYER_SIZE = 64;
    const PLAYER_SPEED = 5;
    
    if (gameStateRef.current.debug) {
      console.log("Initializing player with dimensions:", width, height);
    }
    
    // Always create a fresh player on initialization
    playerRef.current = {
      x: width / 4 - PLAYER_SIZE / 2,
      y: height / 2 - PLAYER_SIZE / 2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      speed: PLAYER_SPEED,
      fireballs: [],
      isMovingUp: false,
      isMovingDown: false,
      isMovingLeft: false,
      isMovingRight: false,
      isShooting: false
    };
    
    if (gameStateRef.current.debug) {
      console.log("Player initialized:", playerRef.current);
    }
    
    return playerRef.current;
  };
  
  // Spawn zombies
  const spawnZombies = (count: number, gameWidth: number, gameHeight: number, zombieSize: number, zombieSpeed: number) => {
    if (gameStateRef.current.debug) {
      console.log(`Spawning ${count} zombies`);
    }
    
    const newZombies: Zombie[] = [];
    
    for (let i = 0; i < count; i++) {
      // Create zombies at staggered positions to prevent overlap
      newZombies.push({
        id: gameStateRef.current.nextZombieId++,
        x: gameWidth - zombieSize - Math.random() * 200,
        y: (gameHeight / count) * i + Math.random() * (gameHeight / count - zombieSize),
        width: zombieSize,
        height: zombieSize,
        speed: zombieSpeed * (0.8 + Math.random() * 0.4),
        lastFireTime: Date.now(),
        fireRate: 2000 + Math.random() * 3000 // Random fire rate between 2-5 seconds
      });
    }
    
    // Add new zombies to the array
    gameStateRef.current.zombies.push(...newZombies);
    
    if (gameStateRef.current.debug) {
      console.log(`Total zombies now: ${gameStateRef.current.zombies.length}`);
    }
    
    return gameStateRef.current.zombies;
  };
  
  // Player hit
  const playerHit = () => {
    // Show hit effect
    setHitEffect(true);
    
    // Reset hit effect after a short delay
    setTimeout(() => {
      setHitEffect(false);
    }, 300);
    
    // Decrease lives
    setLives(prevLives => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        setFinalScore(score);
        setGameState('gameover');
      } else {
        setGameState('countdown');
        setCountdown(3);
      }
      return newLives;
    });
  };
  
  // Start or restart game
  const resetGame = () => {
    if (gameStateRef.current.debug) {
      console.log("Resetting game state");
    }
    
    setScore(0);
    setLives(4);
    setGameStartTime(Date.now());
    
    // Reset game state
    gameStateRef.current.zombies = [];
    gameStateRef.current.enemyFireballs = [];
    gameStateRef.current.zombiesKilled = 0;
    gameStateRef.current.currentWaveSize = 1;
    
    // Set game state to playing
    setGameState('playing');
    
    if (gameStateRef.current.debug) {
      console.log("Game state reset, now playing");
    }
  };
  
  return {
    score,
    setScore,
    lives,
    setLives,
    gameState,
    setGameState,
    countdown,
    setCountdown,
    finalScore,
    setFinalScore,
    hitEffect,
    gameStartTime,
    playerRef,
    gameStateRef,
    initializePlayer,
    spawnZombies,
    playerHit,
    resetGame
  };
}; 