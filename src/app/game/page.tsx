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
    fireballs: [] as Array<{x: number, y: number, curve: number, speed: number}>,
    isMovingUp: false,
    isMovingDown: false,
    isMovingLeft: false,
    isMovingRight: false,
    isShooting: false
  });
  
  // Game state
  const gameStateRef = useRef({
    zombies: [] as Array<{
      id: number, 
      x: number, 
      y: number, 
      width: number, 
      height: number, 
      speed: number, 
      lastFireTime: number, 
      fireRate: number
    }>,
    enemyFireballs: [] as Array<{x: number, y: number, angle: number, speed: number}>,
    zombiesKilled: 0,
    currentWaveSize: 1,
    nextZombieId: 1,
    gameStartTime: 0
  });
  
  // Main game loop effect for 'playing' state
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
    
    // Set game start time
    if (gameStateRef.current.gameStartTime === 0) {
      gameStateRef.current.gameStartTime = Date.now();
    }
    
    // Load images
    const playerImage = new (window.Image as any)() as HTMLImageElement;
    playerImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64shooter.png";
    
    const zombieImage = new (window.Image as any)() as HTMLImageElement;
    zombieImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png";
    
    // Game constants
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const PLAYER_SIZE = 64;
    const ZOMBIE_SIZE = 64;
    const FIREBALL_SIZE = 20;
    const FIREBALL_SPEED = 7;
    const ZOMBIE_SPEED = 1.5;
    const ENEMY_FIREBALL_SPEED = 3;
    const BOUNDARY_LEFT = 0;
    const BOUNDARY_RIGHT = GAME_WIDTH / 2;
    const BOUNDARY_TOP = 0;
    const BOUNDARY_BOTTOM = GAME_HEIGHT;
    
    // Access player and zombies
    const player = playerRef.current;
    const { zombies, enemyFireballs } = gameStateRef.current;
    
    // Spawn zombies if needed
    if (zombies.length === 0) {
      spawnZombies(gameStateRef.current.currentWaveSize);
    }
    
    // Spawn zombies function
    function spawnZombies(count: number) {
      console.log(`Spawning ${count} zombies`);
      
      for (let i = 0; i < count; i++) {
        zombies.push({
          id: gameStateRef.current.nextZombieId++,
          x: GAME_WIDTH - ZOMBIE_SIZE - Math.random() * 200,
          y: (GAME_HEIGHT / count) * i + Math.random() * (GAME_HEIGHT / count - ZOMBIE_SIZE),
          width: ZOMBIE_SIZE,
          height: ZOMBIE_SIZE,
          speed: ZOMBIE_SPEED * (0.8 + Math.random() * 0.4),
          lastFireTime: Date.now(),
          fireRate: 2000 + Math.random() * 3000
        });
      }
      
      console.log(`Total zombies now: ${zombies.length}`);
    }
    
    // Game loop
    let animationFrameId: number;
    
    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          player.isMovingUp = true;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          player.isMovingDown = true;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          player.isMovingLeft = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          player.isMovingRight = true;
          break;
        case ' ': // Spacebar
          if (!player.isShooting) {
            player.isShooting = true;
            player.fireballs.push({
              x: player.x + player.width,
              y: player.y + player.height / 2,
              curve: (Math.random() - 0.5) * 2,
              speed: FIREBALL_SPEED
            });
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          player.isMovingUp = false;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          player.isMovingDown = false;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          player.isMovingLeft = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          player.isMovingRight = false;
          break;
        case ' ': // Spacebar
          player.isShooting = false;
          break;
      }
    };
    
    // Mouse handlers for shooting
    const handleMouseDown = (e: MouseEvent) => {
      if (gameState !== 'playing') return;
      
      player.isShooting = true;
      player.fireballs.push({
        x: player.x + player.width,
        y: player.y + player.height / 2,
        curve: (Math.random() - 0.5) * 2,
        speed: FIREBALL_SPEED
      });
    };

    const handleMouseUp = () => {
      if (gameState !== 'playing') return;
      player.isShooting = false;
    };
    
    // Update player position
    const updatePlayerPosition = () => {
      if (player.isMovingUp) player.y = Math.max(BOUNDARY_TOP, player.y - player.speed);
      if (player.isMovingDown) player.y = Math.min(BOUNDARY_BOTTOM - player.height, player.y + player.speed);
      if (player.isMovingLeft) player.x = Math.max(BOUNDARY_LEFT, player.x - player.speed);
      if (player.isMovingRight) player.x = Math.min(BOUNDARY_RIGHT - player.width, player.x + player.speed);
    };
    
    // Function to handle player getting hit
    const playerHit = () => {
      setHitEffect(true);
      
      setTimeout(() => {
        setHitEffect(false);
      }, 300);
      
      setLives(prevLives => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          setFinalScore(score);
          setTimeout(() => {
            setGameState('gameover');
          }, 500);
        } else {
          setGameState('countdown');
          setCountdown(3);
        }
        return newLives;
      });
    };
    
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      
      // Update player position
      updatePlayerPosition();
      
      // Draw player
      try {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
      } catch (e) {
        // Fallback if image fails to load
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }
      
      // Update and draw player fireballs
      for (let i = player.fireballs.length - 1; i >= 0; i--) {
        const fireball = player.fireballs[i];
        fireball.x += fireball.speed;
        fireball.y += fireball.curve || 0;
        
        // Draw fireball
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(fireball.x, fireball.y, FIREBALL_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Remove fireballs that are off-screen
        if (fireball.x > GAME_WIDTH) {
          player.fireballs.splice(i, 1);
          continue;
        }
        
        // Check for collision with zombies
        let hitZombieIndex = -1;
        
        for (let j = 0; j < zombies.length; j++) {
          const zombie = zombies[j];
          if (!zombie) continue;
          
          if (
            fireball.x + FIREBALL_SIZE / 2 > zombie.x &&
            fireball.x - FIREBALL_SIZE / 2 < zombie.x + zombie.width &&
            fireball.y + FIREBALL_SIZE / 2 > zombie.y &&
            fireball.y - FIREBALL_SIZE / 2 < zombie.y + zombie.height
          ) {
            // Found a hit
            hitZombieIndex = j;
            break;
          }
        }
        
        if (hitZombieIndex !== -1) {
          // Remove the fireball
          player.fireballs.splice(i, 1);
          
          // Remove the zombie
          if (hitZombieIndex >= 0 && hitZombieIndex < zombies.length) {
            zombies.splice(hitZombieIndex, 1);
            gameStateRef.current.zombiesKilled++;
            
            // Update score
            setScore(prevScore => prevScore + 100);
            
            // Check if all zombies are gone
            if (zombies.length === 0) {
              console.log(`Wave cleared! Doubling zombies from ${gameStateRef.current.currentWaveSize} to ${gameStateRef.current.currentWaveSize * 2}`);
              
              // Double the wave size
              gameStateRef.current.currentWaveSize *= 2;
              
              // Spawn new zombies
              setTimeout(() => {
                spawnZombies(gameStateRef.current.currentWaveSize);
              }, 50);
            }
          }
          
          continue;
        }
      }
      
      // Update and draw zombies
      const zombiesToRemove: number[] = [];
      
      for (let i = 0; i < zombies.length; i++) {
        const zombie = zombies[i];
        if (!zombie) continue;
        
        // Move zombie towards player
        const angle = Math.atan2(player.y + player.height / 2 - (zombie.y + zombie.height / 2), 
                               player.x + player.width / 2 - (zombie.x + zombie.width / 2));
        
        // Calculate new position with boundary checks
        const newX = zombie.x + Math.cos(angle) * zombie.speed;
        const newY = zombie.y + Math.sin(angle) * zombie.speed;
        
        if (newX >= 0 && newX + zombie.width <= GAME_WIDTH) {
          zombie.x = newX;
        }
        
        if (newY >= 0 && newY + zombie.height <= GAME_HEIGHT) {
          zombie.y = newY;
        }
        
        // Check for collision with player
        if (
          player.x < zombie.x + zombie.width * 0.7 &&
          player.x + player.width * 0.7 > zombie.x &&
          player.y < zombie.y + zombie.height * 0.7 &&
          player.y + player.height * 0.7 > zombie.y
        ) {
          // Mark zombie for removal
          zombiesToRemove.push(i);
          
          // Player hit
          playerHit();
          continue;
        }
        
        // Draw zombie
        ctx.save();
        try {
          const safeAngle = angle || 0;
          ctx.translate(zombie.x + zombie.width / 2, zombie.y + zombie.height / 2);
          ctx.rotate(safeAngle);
          ctx.drawImage(zombieImage, -zombie.width / 2, -zombie.height / 2, zombie.width, zombie.height);
        } catch (e) {
          // Fallback if image fails
          ctx.fillStyle = '#00FF00';
          ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
        } finally {
          ctx.restore();
        }
      }
      
      // Remove zombies marked for removal
      for (let i = zombiesToRemove.length - 1; i >= 0; i--) {
        const index = zombiesToRemove[i];
        if (index >= 0 && index < zombies.length) {
          zombies.splice(index, 1);
        }
      }
      
      // Update score based on survival time
      if (gameState === 'playing') {
        const survivalTimeScore = Math.floor((Date.now() - gameStateRef.current.gameStartTime) / 1000);
        setScore(prevScore => Math.max(prevScore, survivalTimeScore * 10 + gameStateRef.current.zombiesKilled * 100));
      }
      
      // Continue game loop if still playing
      if (gameState === 'playing') {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    // Start game loop when image is loaded or after a timeout
    playerImage.onload = () => {
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
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameState, score]);
  
  // Separate effect for countdown
  useEffect(() => {
    if (gameState !== 'countdown') return;
    
    console.log("Countdown started:", countdown);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameState('playing');
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  }, [gameState, countdown]);
  
  const startGame = () => {
    console.log("Starting game...");
    
    // Reset game state
    gameStateRef.current.zombies = [];
    gameStateRef.current.enemyFireballs = [];
    gameStateRef.current.zombiesKilled = 0;
    gameStateRef.current.currentWaveSize = 1;
    gameStateRef.current.gameStartTime = Date.now();
    
    setScore(0);
    setLives(4);
    setGameState('playing');
  };
  
  const restartGame = () => {
    // Reset game state
    gameStateRef.current.zombies = [];
    gameStateRef.current.enemyFireballs = [];
    gameStateRef.current.zombiesKilled = 0;
    gameStateRef.current.currentWaveSize = 1;
    gameStateRef.current.gameStartTime = Date.now();
    
    setScore(0);
    setLives(4);
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
              Click to shoot. Move with keyboard.
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