"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'countdown' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(4);
  const [countdown, setCountdown] = useState(3);
  const [finalScore, setFinalScore] = useState(0);
  const [hitEffect, setHitEffect] = useState(false);
  
  // Player state
  const playerRef = useRef({
    x: 200,
    y: 250,
    width: 64,
    height: 64,
    speed: 5,
    fireballs: [],
    isMovingUp: false,
    isMovingDown: false,
    isMovingLeft: false,
    isMovingRight: false,
    isShooting: false
  });
  
  // Game state
  const gameStateRef = useRef({
    zombies: [],
    enemyFireballs: [],
    zombiesKilled: 0,
    currentWaveSize: 1,
    nextZombieId: 1
  });
  
  // Handle game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    console.log("Game started");
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }
    
    // Load images
    const playerImage = new Image();
    playerImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64shooter.png";
    
    const zombieImage = new Image();
    zombieImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png";
    
    // Game constants
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const PLAYER_SIZE = 64;
    const ZOMBIE_SIZE = 64;
    
    // Game loop
    let animationFrameId: number;
    
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      
      // Draw player
      const player = playerRef.current;
      try {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
      } catch (e) {
        // Fallback if image fails to load
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }
      
      // Continue game loop
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    playerImage.onload = () => {
      // Start game loop once image is loaded
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Fallback if image doesn't load
    setTimeout(() => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    }, 1000);
    
    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameState]);
  
  const startGame = () => {
    console.log("Starting game...");
    setGameState('playing');
  };
  
  const restartGame = () => {
    setScore(0);
    setLives(4);
    
    // Reset game state
    gameStateRef.current.zombies = [];
    gameStateRef.current.enemyFireballs = [];
    gameStateRef.current.zombiesKilled = 0;
    gameStateRef.current.currentWaveSize = 1;
    
    setGameState('playing');
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex items-center justify-between w-full max-w-[800px]">
        <div className="flex flex-row">
          {Array.from({ length: lives }).map((_, index) => (
            <div key={index} className="w-8 h-8 relative mr-2 inline-block">
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64shooter.png"
                alt="Life"
                width={32}
                height={32}
                unoptimized={true}
              />
            </div>
          ))}
        </div>
        <div className="text-2xl font-bold">Score: {score}</div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className={`border border-gray-300 bg-white ${hitEffect ? 'opacity-70 shadow-[0_0_10px_5px_rgba(255,0,0,0.7)]' : ''}`}
        />
        
        {hitEffect && (
          <div className="absolute inset-0 bg-red-500/20 pointer-events-none border-2 border-red-500" />
        )}
        
        {gameState === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
            <h1 className="text-4xl mb-6">AMMO CAT</h1>
            <p className="mb-8 text-center max-w-md">
              <span className="block font-bold mb-2">Desktop Controls:</span>
              Use WASD or arrow keys to move. Spacebar to shoot.
              <br /><br />
              <span className="block font-bold mb-2">Mobile Controls:</span>
              Drag the cat to move. Tap anywhere to shoot.
              <br /><br />
              Survive as long as possible and defeat the zombie cats!
            </p>
            <button
              onClick={startGame}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg text-xl"
            >
              Start Game
            </button>
          </div>
        )}
        
        {gameState === 'countdown' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <div className="text-7xl font-bold">{countdown}</div>
          </div>
        )}
        
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
            <h2 className="text-4xl mb-2">Game Over</h2>
            <p className="text-2xl mb-6">Final Score: {finalScore}</p>
            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium">
          Return to Shop
        </Link>
      </div>
    </div>
  );
} 