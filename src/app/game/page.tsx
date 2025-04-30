"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGameState } from './useGameState';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    score,
    setScore,
    lives,
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
  } = useGameState();
  
  // Game assets preloading
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Initialize player position
  useEffect(() => {
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    
    initializePlayer(GAME_WIDTH, GAME_HEIGHT);
  }, [initializePlayer]);
  
  useEffect(() => {
    // Preload images
    const playerImg = new window.Image() as HTMLImageElement;
    playerImg.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64shooter.png";
    playerImg.crossOrigin = "anonymous";
    
    const zombieImg = new window.Image() as HTMLImageElement;
    zombieImg.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png";
    zombieImg.crossOrigin = "anonymous";
    
    Promise.all([
      new Promise<void>(resolve => { playerImg.onload = () => resolve(); }),
      new Promise<void>(resolve => { zombieImg.onload = () => resolve(); })
    ]).then(() => {
      setAssetsLoaded(true);
    });
    
    // If images take too long, set assetsLoaded anyway after a timeout
    const timeout = setTimeout(() => {
      setAssetsLoaded(true);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!assetsLoaded || gameState === 'ready' || gameState === 'gameover') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game constants
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;
    const PLAYER_SIZE = 64;
    const ZOMBIE_SIZE = 64;
    const FIREBALL_SIZE = 20;
    const FIREBALL_SPEED = 7;
    const ZOMBIE_SPEED = 1.5;
    const ENEMY_FIREBALL_SPEED = 3;
    const PLAYER_SPEED = 5;
    const BOUNDARY_LEFT = 0;
    const BOUNDARY_RIGHT = GAME_WIDTH / 2;
    const BOUNDARY_TOP = 0;
    const BOUNDARY_BOTTOM = GAME_HEIGHT;

    // Load game images
    const playerImage = new window.Image() as HTMLImageElement;
    playerImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64shooter.png";
    playerImage.crossOrigin = "anonymous";
    
    const zombieImage = new window.Image() as HTMLImageElement;
    zombieImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png";
    zombieImage.crossOrigin = "anonymous";

    // Use the ref for player state
    let player = playerRef.current;
    if (!player) return;

    // Accessing zombie data from the ref
    const { zombies, enemyFireballs, currentWaveSize } = gameStateRef.current;
    
    // Initial spawn if needed
    if (gameState === 'playing' && zombies.length === 0) {
      spawnZombies(gameStateRef.current.currentWaveSize, GAME_WIDTH, GAME_HEIGHT, ZOMBIE_SIZE, ZOMBIE_SPEED);
    }
    
    // Game loop
    let animationFrameId: number;
    let lastTime = 0;

    // Handle touch input - completely rewrite for drag movement
    let touchDragActive = false;
    let touchTargetX = 0;
    let touchTargetY = 0;
    let lastTouchTime = 0;
    const TOUCH_TAP_THRESHOLD = 200; // ms to distinguish tap from drag

    const handleTouchStart = (e: TouchEvent) => {
      if (gameState !== 'playing') return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      // Record start time for tap detection
      lastTouchTime = Date.now();
      
      // Set initial position for potential drag
      touchTargetX = touchX;
      touchTargetY = touchY;
      touchDragActive = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameState !== 'playing' || !touchDragActive) return;
      
      // If touch is moving, this is a drag operation
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      
      // Update target position that player should move towards
      touchTargetX = touch.clientX - rect.left;
      touchTargetY = touch.clientY - rect.top;
      
      // Constrain target to player boundaries
      touchTargetX = Math.min(Math.max(touchTargetX, BOUNDARY_LEFT + player.width / 2), BOUNDARY_RIGHT - player.width / 2);
      touchTargetY = Math.min(Math.max(touchTargetY, BOUNDARY_TOP + player.height / 2), BOUNDARY_BOTTOM - player.height / 2);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (gameState !== 'playing') return;
      
      // Check if this was a tap (short duration touch)
      const touchDuration = Date.now() - lastTouchTime;
      
      if (touchDuration < TOUCH_TAP_THRESHOLD) {
        // This was a tap - shoot
        player.fireballs.push({
          x: player.x + player.width,
          y: player.y + player.height / 2,
          curve: (Math.random() - 0.5) * 2, // Random curve for fireballs
          speed: 7 // Add the required speed property
        });
      }
      
      // End drag operation
      touchDragActive = false;
    };

    // Add drag movement update to game loop
    const updatePlayerPosition = () => {
      // Handle keyboard movement
      if (player.isMovingUp) player.y = Math.max(BOUNDARY_TOP, player.y - player.speed);
      if (player.isMovingDown) player.y = Math.min(BOUNDARY_BOTTOM - player.height, player.y + player.speed);
      if (player.isMovingLeft) player.x = Math.max(BOUNDARY_LEFT, player.x - player.speed);
      if (player.isMovingRight) player.x = Math.min(BOUNDARY_RIGHT - player.width, player.x + player.speed);
      
      // Handle touch drag movement
      if (touchDragActive) {
        // Move player towards touch target
        const targetCenterX = touchTargetX;
        const targetCenterY = touchTargetY;
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        
        // Calculate direction vector
        const dirX = targetCenterX - playerCenterX;
        const dirY = targetCenterY - playerCenterY;
        
        // Normalize and scale by player speed
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        
        if (length > player.speed) {
          // Only move if we're not already at the target
          player.x += (dirX / length) * player.speed;
          player.y += (dirY / length) * player.speed;
          
          // Ensure player stays within boundaries
          player.x = Math.max(BOUNDARY_LEFT, Math.min(BOUNDARY_RIGHT - player.width, player.x));
          player.y = Math.max(BOUNDARY_TOP, Math.min(BOUNDARY_BOTTOM - player.height, player.y));
        }
      }
    };

    // Make sure the player stays within boundaries
    const keepPlayerInBounds = () => {
      player.x = Math.max(BOUNDARY_LEFT, Math.min(BOUNDARY_RIGHT - player.width, player.x));
      player.y = Math.max(BOUNDARY_TOP, Math.min(BOUNDARY_BOTTOM - player.height, player.y));
    };

    const gameLoop = (timestamp: number) => {
      // Calculate delta time
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Clear canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Update player position - use the new function
      updatePlayerPosition();
      keepPlayerInBounds();

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
        fireball.x += FIREBALL_SPEED;
        
        // Apply curve if it exists, otherwise default to 0
        fireball.y += fireball.curve || 0;

        // Draw player fireball
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
          // Skip if zombie is somehow undefined (this prevents errors)
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
            setScore(prevScore => Math.floor(prevScore + 100));
            
            // Check if all zombies are gone
            if (zombies.length === 0) {
              console.log(`Wave cleared! Doubling zombies from ${gameStateRef.current.currentWaveSize} to ${gameStateRef.current.currentWaveSize * 2}`);
              
              // Double the wave size
              gameStateRef.current.currentWaveSize *= 2;
              
              // Spawn new zombies with a slight delay to prevent frame issues
              setTimeout(() => {
                spawnZombies(gameStateRef.current.currentWaveSize, GAME_WIDTH, GAME_HEIGHT, ZOMBIE_SIZE, ZOMBIE_SPEED);
              }, 50);
            }
          }
          
          continue; // Skip to next fireball
        }
      }

      // Update and draw zombies with a safer approach
      const zombiesToRemove: number[] = [];
      
      for (let i = 0; i < zombies.length; i++) {
        const zombie = zombies[i];
        // Skip if zombie is somehow undefined (this prevents errors)
        if (!zombie) continue;
        
        // Move zombie towards player with safer boundary checking
        const angle = Math.atan2(player.y + player.height / 2 - (zombie.y + zombie.height / 2), 
                                player.x + player.width / 2 - (zombie.x + zombie.width / 2));
        
        // Calculate new position
        const newX = zombie.x + Math.cos(angle) * zombie.speed;
        const newY = zombie.y + Math.sin(angle) * zombie.speed;
        
        // Only update position if it's within game boundaries
        if (newX >= 0 && newX + zombie.width <= GAME_WIDTH) {
          zombie.x = newX;
        }
        
        if (newY >= 0 && newY + zombie.height <= GAME_HEIGHT) {
          zombie.y = newY;
        }

        // Check for direct collision with player
        if (
          player.x < zombie.x + zombie.width * 0.7 &&
          player.x + player.width * 0.7 > zombie.x &&
          player.y < zombie.y + zombie.height * 0.7 &&
          player.y + player.height * 0.7 > zombie.y
        ) {
          // Mark zombie for removal instead of removing it during iteration
          zombiesToRemove.push(i);
          
          // Player collided with zombie
          playerHit();
          continue; // Skip drawing this zombie
        }

        // Draw zombie with a safety check
        ctx.save();
        try {
          // Use default value for angle if undefined
          const safeAngle = angle || 0;
          ctx.translate(zombie.x + zombie.width / 2, zombie.y + zombie.height / 2);
          ctx.rotate(safeAngle);
          ctx.drawImage(zombieImage, -zombie.width / 2, -zombie.height / 2, zombie.width, zombie.height);
        } catch (e) {
          // Fallback if image fails or transform causes issues
          ctx.fillStyle = '#00FF00';
          ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
        } finally {
          ctx.restore();
        }

        // Zombie shoots fireballs
        const now = Date.now();
        if (now - zombie.lastFireTime > zombie.fireRate) {
          zombie.lastFireTime = now;
          enemyFireballs.push({
            x: zombie.x,
            y: zombie.y + zombie.height / 2,
            angle: angle,
            speed: ENEMY_FIREBALL_SPEED
          });
        }
      }
      
      // Remove zombies marked for removal (in reverse order to avoid index shifting problems)
      for (let i = zombiesToRemove.length - 1; i >= 0; i--) {
        const index = zombiesToRemove[i];
        if (index >= 0 && index < zombies.length) {
          zombies.splice(index, 1);
        }
      }

      // Update and draw enemy fireballs
      for (let i = enemyFireballs.length - 1; i >= 0; i--) {
        const fireball = enemyFireballs[i];
        fireball.x += Math.cos(fireball.angle) * fireball.speed;
        fireball.y += Math.sin(fireball.angle) * fireball.speed;

        // Draw enemy fireball
        ctx.fillStyle = '#FF5500';
        ctx.beginPath();
        ctx.arc(fireball.x, fireball.y, FIREBALL_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();

        // Remove fireballs that are off-screen
        if (
          fireball.x < 0 || 
          fireball.x > GAME_WIDTH || 
          fireball.y < 0 || 
          fireball.y > GAME_HEIGHT
        ) {
          enemyFireballs.splice(i, 1);
          continue;
        }

        // Check for collision with player
        if (
          fireball.x + FIREBALL_SIZE / 2 > player.x &&
          fireball.x - FIREBALL_SIZE / 2 < player.x + player.width &&
          fireball.y + FIREBALL_SIZE / 2 > player.y &&
          fireball.y - FIREBALL_SIZE / 2 < player.y + player.height
        ) {
          // Player hit by enemy fireball
          enemyFireballs.splice(i, 1);
          
          playerHit();
          continue;
        }
      }

      // Update score based on survival time
      if (gameState === 'playing') {
        const survivalTimeScore = Math.floor((Date.now() - gameStartTime) / 1000);
        setScore(prevScore => Math.max(prevScore, survivalTimeScore * 10 + gameStateRef.current.zombiesKilled * 100));
      }

      // Continue game loop
      if (gameState === 'playing') {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    // Start game loop
    if (gameState === 'playing') {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(gameLoop);
    }

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
              curve: (Math.random() - 0.5) * 2, // Random curve for fireballs
              speed: 7 // Add the required speed property
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

    // Handle mouse input for shooting
    const handleMouseDown = (e: MouseEvent) => {
      if (gameState !== 'playing') return;
      
      // Allow shooting from anywhere on screen, not just right half
      player.isShooting = true;
      player.fireballs.push({
        x: player.x + player.width,
        y: player.y + player.height / 2,
        curve: (Math.random() - 0.5) * 2, // Random curve for fireballs
        speed: 7 // Add the required speed property
      });
      
      // Also handle movement based on mouse position
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Left half of screen controls movement
      if (x < GAME_WIDTH / 2) {
        // Movement
        const isTop = y < GAME_HEIGHT / 2;
        const isLeft = x < GAME_WIDTH / 4;
        
        if (isTop) player.isMovingUp = true;
        else player.isMovingDown = true;
        
        if (isLeft) player.isMovingLeft = true;
        else player.isMovingRight = true;
      }
    };

    const handleMouseUp = () => {
      if (gameState !== 'playing') return;
      player.isShooting = false;
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Countdown timer
    if (gameState === 'countdown') {
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
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameState, assetsLoaded, score]);

  // When the game restarts or starts from countdown, reset player position properly
  useEffect(() => {
    if (gameState === 'playing') {
      // This will ensure the player starts at the right place after countdown
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const GAME_WIDTH = 800;
      const GAME_HEIGHT = 600;
      const PLAYER_SIZE = 64;
      const PLAYER_SPEED = 5;
      
      // Initialize player if needed
      if (!playerRef.current) {
        playerRef.current = {
          x: GAME_WIDTH / 4 - PLAYER_SIZE / 2,
          y: GAME_HEIGHT / 2 - PLAYER_SIZE / 2,
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
      }
      
      // Draw player in current position
      const ctx = canvas.getContext('2d');
      if (ctx && playerRef.current) {
        const playerImage = new window.Image() as HTMLImageElement;
        playerImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64shooter.png";
        playerImage.crossOrigin = "anonymous";
        
        try {
          ctx.drawImage(playerImage, playerRef.current.x, playerRef.current.y, PLAYER_SIZE, PLAYER_SIZE);
        } catch (e) {
          // Fallback
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(playerRef.current.x, playerRef.current.y, PLAYER_SIZE, PLAYER_SIZE);
        }
      }
    }
  }, [gameState]);

  const startGame = () => {
    resetGame();
  };

  const restartGame = () => {
    resetGame();
  };

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `ammo-cat-score-${finalScore}.png`;
    link.click();
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
              <button
                onClick={takeScreenshot}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg"
              >
                Screenshot
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