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
  
  // Game assets preloading
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Add debugging state to track image loading
  const [debugInfo, setDebugInfo] = useState<string>('Starting...');
  
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

    // Game state
    let player = {
      x: GAME_WIDTH / 4 - PLAYER_SIZE / 2,
      y: GAME_HEIGHT / 2 - PLAYER_SIZE / 2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      speed: PLAYER_SPEED,
      fireballs: [] as any[],
      isMovingUp: false,
      isMovingDown: false,
      isMovingLeft: false,
      isMovingRight: false,
      isShooting: false
    };

    let zombies: any[] = [];
    let enemyFireballs: any[] = [];
    let zombiesKilled = 0;
    let currentWaveSize = 1;
    let gameStartTime = Date.now();
    let lastZombieSpawnTime = 0;
    let scoreMultiplier = 1;
    let consecutiveHits = 0;
    let lastHitTime = 0;

    // Load images
    const playerImage = new window.Image() as HTMLImageElement;
    playerImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64shooter.png";
    playerImage.crossOrigin = "anonymous";

    const zombieImage = new window.Image() as HTMLImageElement;
    zombieImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png";
    zombieImage.crossOrigin = "anonymous";

    // Spawn initial zombies
    const spawnZombies = (count: number) => {
      console.log(`Spawning ${count} zombies`);
      for (let i = 0; i < count; i++) {
        zombies.push({
          x: GAME_WIDTH - ZOMBIE_SIZE - Math.random() * 100,
          y: Math.random() * (GAME_HEIGHT - ZOMBIE_SIZE),
          width: ZOMBIE_SIZE,
          height: ZOMBIE_SIZE,
          speed: ZOMBIE_SPEED * (0.8 + Math.random() * 0.4),
          lastFireTime: Date.now(),
          fireRate: 2000 + Math.random() * 3000 // Random fire rate between 2-5 seconds
        });
      }
    };

    // Initial spawn
    if (gameState === 'playing' && zombies.length === 0) {
      spawnZombies(currentWaveSize);
    }

    // Game loop
    let animationFrameId: number;
    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      // Calculate delta time
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Clear canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Add debug text
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.fillText(`Player: (${Math.floor(player.x)}, ${Math.floor(player.y)})`, 10, 20);
      ctx.fillText(`Zombies: ${zombies.length}`, 10, 40);
      ctx.fillText(`Fireballs: ${player.fireballs.length}`, 10, 60);
      
      // Draw player - first draw a fallback rectangle
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Then try to draw the image
      try {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
      } catch (e) {
        console.error('Failed to draw player image:', e);
      }

      // Update player position
      if (player.isMovingUp) player.y = Math.max(BOUNDARY_TOP, player.y - player.speed);
      if (player.isMovingDown) player.y = Math.min(BOUNDARY_BOTTOM - player.height, player.y + player.speed);
      if (player.isMovingLeft) player.x = Math.max(BOUNDARY_LEFT, player.x - player.speed);
      if (player.isMovingRight) player.x = Math.min(BOUNDARY_RIGHT - player.width, player.x + player.speed);

      // Update and draw player fireballs
      for (let i = player.fireballs.length - 1; i >= 0; i--) {
        const fireball = player.fireballs[i];
        fireball.x += FIREBALL_SPEED;
        fireball.y += fireball.curve;

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
        let hitZombie = false;
        for (let j = zombies.length - 1; j >= 0; j--) {
          const zombie = zombies[j];
          if (
            fireball.x + FIREBALL_SIZE / 2 > zombie.x &&
            fireball.x - FIREBALL_SIZE / 2 < zombie.x + zombie.width &&
            fireball.y + FIREBALL_SIZE / 2 > zombie.y &&
            fireball.y - FIREBALL_SIZE / 2 < zombie.y + zombie.height
          ) {
            // Collision detected - remove both fireball and zombie
            player.fireballs.splice(i, 1);
            zombies.splice(j, 1);
            zombiesKilled++;
            hitZombie = true;
            
            // Update score and multiplier
            const now = Date.now();
            if (now - lastHitTime < 2000) {
              consecutiveHits++;
              scoreMultiplier = Math.min(10, 1 + consecutiveHits * 0.5);
            } else {
              consecutiveHits = 1;
              scoreMultiplier = 1;
            }
            lastHitTime = now;
            
            setScore(prevScore => Math.floor(prevScore + 100 * scoreMultiplier));
            
            // If all zombies are killed, spawn more
            if (zombies.length === 0) {
              console.log(`Wave cleared! Doubling zombies from ${currentWaveSize} to ${currentWaveSize * 2}`);
              currentWaveSize *= 2;
              spawnZombies(currentWaveSize);
            }
            break;
          }
        }
        
        if (hitZombie) {
          continue; // Skip to next fireball since this one has been removed
        }
      }

      // Update and draw zombies
      zombies.forEach(zombie => {
        // Move zombie towards player
        const angle = Math.atan2(player.y + player.height / 2 - (zombie.y + zombie.height / 2), 
                                player.x + player.width / 2 - (zombie.x + zombie.width / 2));
        zombie.x += Math.cos(angle) * zombie.speed;
        zombie.y += Math.sin(angle) * zombie.speed;

        // Check for direct collision with player
        if (
          player.x < zombie.x + zombie.width &&
          player.x + player.width > zombie.x &&
          player.y < zombie.y + zombie.height &&
          player.y + player.height > zombie.y
        ) {
          // Player collided with zombie
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
          // Remove the zombie that collided
          zombies.splice(zombies.indexOf(zombie), 1);
          
          // Don't immediately move the player back to start - this will happen after countdown
          return;
        }

        // Rotate and draw zombie
        ctx.save();
        ctx.translate(zombie.x + zombie.width / 2, zombie.y + zombie.height / 2);
        ctx.rotate(angle);
        try {
          ctx.drawImage(zombieImage, -zombie.width / 2, -zombie.height / 2, zombie.width, zombie.height);
        } catch (e) {
          // Fallback if image fails to load
          ctx.fillStyle = '#00FF00';
          ctx.fillRect(-zombie.width / 2, -zombie.height / 2, zombie.width, zombie.height);
        }
        ctx.restore();

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
      });

      // Update and draw enemy fireballs
      for (let i = enemyFireballs.length - 1; i >= 0; i--) {
        const fireball = enemyFireballs[i];
        fireball.x += Math.cos(fireball.angle) * fireball.speed;
        fireball.y += Math.sin(fireball.angle) * fireball.speed;

        // Draw enemy fireball
        ctx.fillStyle = '#FF4500'; // Orange-red for enemy fireballs
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
          // Player is hit
          enemyFireballs.splice(i, 1);
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
          break;
        }
      }

      // Update score based on survival time
      if (gameState === 'playing') {
        const survivalTimeScore = Math.floor((Date.now() - gameStartTime) / 1000);
        setScore(prevScore => Math.max(prevScore, survivalTimeScore * 10 + zombiesKilled * 100));
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
              curve: (Math.random() - 0.5) * 2 // Random curve for fireballs
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

    // Handle touch input - improved for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (gameState !== 'playing') return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      // Check if the player was touched (to start drag)
      const touchedPlayer = 
        touchX >= player.x && 
        touchX <= player.x + player.width && 
        touchY >= player.y && 
        touchY <= player.y + player.height;
      
      if (touchedPlayer) {
        // Starting a drag operation
        canvas.setAttribute('data-dragging', 'true');
        canvas.setAttribute('data-drag-start-x', touchX.toString());
        canvas.setAttribute('data-drag-start-y', touchY.toString());
        canvas.setAttribute('data-player-start-x', player.x.toString());
        canvas.setAttribute('data-player-start-y', player.y.toString());
      } else {
        // If not dragging, any touch is a shot
        player.fireballs.push({
          x: player.x + player.width,
          y: player.y + player.height / 2,
          curve: (Math.random() - 0.5) * 2 // Random curve for fireballs
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameState !== 'playing') return;
      
      // Only process if we're dragging the player
      if (canvas.getAttribute('data-dragging') === 'true') {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        // Get the starting position
        const dragStartX = parseFloat(canvas.getAttribute('data-drag-start-x') || '0');
        const dragStartY = parseFloat(canvas.getAttribute('data-drag-start-y') || '0');
        const playerStartX = parseFloat(canvas.getAttribute('data-player-start-x') || '0');
        const playerStartY = parseFloat(canvas.getAttribute('data-player-start-y') || '0');
        
        // Calculate the new position based on drag distance
        const dx = touchX - dragStartX;
        const dy = touchY - dragStartY;
        
        // Update player position with boundary checks
        player.x = Math.max(BOUNDARY_LEFT, Math.min(BOUNDARY_RIGHT - player.width, playerStartX + dx));
        player.y = Math.max(BOUNDARY_TOP, Math.min(BOUNDARY_BOTTOM - player.height, playerStartY + dy));
      }
    };

    const handleTouchEnd = () => {
      if (gameState !== 'playing') return;
      // Reset dragging state
      canvas.setAttribute('data-dragging', 'false');
    };

    // Handle mouse input for shooting
    const handleMouseDown = (e: MouseEvent) => {
      if (gameState !== 'playing') return;
      
      // Allow shooting from anywhere on screen, not just right half
      player.isShooting = true;
      player.fireballs.push({
        x: player.x + player.width,
        y: player.y + player.height / 2,
        curve: (Math.random() - 0.5) * 2 // Random curve for fireballs
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
      
      // Force redraw of player in correct position on first frame
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const playerImage = new window.Image() as HTMLImageElement;
        playerImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64shooter.png";
        playerImage.crossOrigin = "anonymous";
        
        const x = GAME_WIDTH / 4 - PLAYER_SIZE / 2;
        const y = GAME_HEIGHT / 2 - PLAYER_SIZE / 2;
        
        try {
          ctx.drawImage(playerImage, x, y, PLAYER_SIZE, PLAYER_SIZE);
        } catch (e) {
          // Fallback
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
        }
      }
    }
  }, [gameState]);

  // Immediate render on game start
  useEffect(() => {
    if (gameState === 'playing') {
      setDebugInfo('Game started. If characters are not visible, they will appear as colored rectangles.');
      
      // Immediately draw the player character with a fallback method
      const canvas = canvasRef.current;
      if (!canvas) {
        setDebugInfo('Error: Canvas not found');
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setDebugInfo('Error: Canvas context not found');
        return;
      }
      
      // Clear canvas and draw player
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 800, 600);
      
      // Get initial player position
      const x = 800 / 4 - 64 / 2;
      const y = 600 / 2 - 64 / 2;
      
      // Always draw fallback rectangle to ensure player is visible
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(x, y, 64, 64);
      
      // Start game animation immediately
      setAssetsLoaded(true);
      
      // Draw fallback zombie for testing
      const zombieX = 800 - 128;
      const zombieY = 600 / 2 - 64 / 2;
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(zombieX, zombieY, 64, 64);
    }
  }, [gameState]);

  // Modify the startGame function to use alternative approach
  const startGame = () => {
    setDebugInfo('Starting game...');
    setScore(0);
    setLives(4);
    
    // Use requestAnimationFrame to ensure state has updated before continuing
    requestAnimationFrame(() => {
      setGameState('playing');
    });
  };

  const restartGame = () => {
    setScore(0);
    setLives(4);
    setGameState('playing');
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

  // Add this to prevent default touch events that might interfere with the game
  useEffect(() => {
    const preventDefaultTouchAction = (e: TouchEvent) => {
      if (e.target === canvasRef.current) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchstart', preventDefaultTouchAction, { passive: false });
    document.addEventListener('touchmove', preventDefaultTouchAction, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', preventDefaultTouchAction);
      document.removeEventListener('touchmove', preventDefaultTouchAction);
    };
  }, []);

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

      {/* Debug info - only visible during development */}
      {process.env.NODE_ENV === 'development' && gameState === 'playing' && (
        <div className="mb-2 w-full max-w-[800px] p-2 bg-gray-100 text-xs overflow-auto max-h-20">
          <p>Debug: {debugInfo}</p>
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 bg-white touch-none select-none"
          style={{ touchAction: 'none' }}
          data-dragging="false"
          data-drag-start-x="0"
          data-drag-start-y="0"
          data-player-start-x="0"
          data-player-start-y="0"
        />
        
        {gameState === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
            <h1 className="text-4xl mb-6">AMMO CAT</h1>
            <p className="mb-8 text-center max-w-md">
              <span className="block mb-3 font-bold">Desktop Controls:</span>
              Use WASD or arrow keys to move. Click or spacebar to shoot.
              <br /><br />
              <span className="block mb-3 font-bold">Mobile Controls:</span>
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