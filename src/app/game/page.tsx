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
      fireRate: number,
      useAltImage: boolean
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
    playerImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png";
    
    const zombieImage = new (window.Image as any)() as HTMLImageElement;
    zombieImage.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png";
    
    const zombieImage2 = new (window.Image as any)() as HTMLImageElement;
    zombieImage2.src = "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64zomb2.png";
    
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
    const BOUNDARY_RIGHT = GAME_WIDTH;
    const BOUNDARY_TOP = 0;
    const BOUNDARY_BOTTOM = GAME_HEIGHT;
    
    // Touch state for mobile controls
    let isDragging = false;
    let lastTapTime = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;
    
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
          fireRate: 2000 + Math.random() * 3000,
          useAltImage: Math.random() < 0.25 // 25% chance of using alt image
        });
      }
      
      console.log(`Total zombies now: ${zombies.length}`);
    }
    
    // Game loop
    let animationFrameId: number;
    
    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      // Prevent default behavior for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
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
    
    // Touch handlers for mobile controls
    const handleTouchStart = (e: TouchEvent) => {
      if (gameState !== 'playing' || !e.touches[0]) return;
      
      // Get the touch position relative to the canvas
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      // Simplified approach: If touch is close to player, start dragging
      // Make the touch target area larger for easier dragging
      const isOnPlayer = Math.abs(touchX - (player.x + player.width/2)) < player.width*1.5 &&
                         Math.abs(touchY - (player.y + player.height/2)) < player.height*1.5;
      
      if (isOnPlayer) {
        // Start dragging
        isDragging = true;
        lastTouchX = touchX;
        lastTouchY = touchY;
      } else {
        // Shoot when tapping outside player area
        player.fireballs.push({
          x: player.x + player.width,
          y: player.y + player.height / 2,
          curve: (Math.random() - 0.5) * 2,
          speed: FIREBALL_SPEED
        });
        lastTapTime = Date.now();
      }
      
      // Prevent default to avoid scrolling the page
      e.preventDefault();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (gameState !== 'playing' || !e.touches[0]) return;
      
      // If dragging started or we're near the player, enable drag
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      // More lenient check to start dragging during movement
      if (!isDragging) {
        const isNearPlayer = Math.abs(touchX - (player.x + player.width/2)) < player.width*2 &&
                            Math.abs(touchY - (player.y + player.height/2)) < player.height*2;
        if (isNearPlayer) {
          isDragging = true;
          lastTouchX = touchX;
          lastTouchY = touchY;
        }
      }
      
      // If we're dragging, move the player
      if (isDragging) {
        // Move player directly to touch position rather than using deltas
        // This feels more natural on mobile
        player.x = Math.max(BOUNDARY_LEFT, Math.min(BOUNDARY_RIGHT - player.width, 
                touchX - player.width/2));
        player.y = Math.max(BOUNDARY_TOP, Math.min(BOUNDARY_BOTTOM - player.height, 
                touchY - player.height/2));
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
          // Choose which zombie image to use based on the useAltImage flag
          const imageToUse = zombie.useAltImage ? zombieImage2 : zombieImage;
          
          // If using alt image, apply additional rotation correction to fix upside-down issue
          if (zombie.useAltImage) {
            ctx.rotate(Math.PI); // Rotate 180 degrees to fix orientation
          }
          
          ctx.drawImage(imageToUse, -zombie.width / 2, -zombie.height / 2, zombie.width, zombie.height);
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
      
      // Update and draw enemy fireballs
      for (let i = enemyFireballs.length - 1; i >= 0; i--) {
        const fireball = enemyFireballs[i];
        const firebAngle = fireball.angle || 0;
        fireball.x += Math.cos(firebAngle) * fireball.speed;
        fireball.y += Math.sin(firebAngle) * fireball.speed;

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
    canvas.addEventListener('touchstart', handleTouchStart as EventListener);
    canvas.addEventListener('touchmove', handleTouchMove as EventListener);
    canvas.addEventListener('touchend', handleTouchEnd as EventListener);
    
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
      canvas.removeEventListener('touchstart', handleTouchStart as EventListener);
      canvas.removeEventListener('touchmove', handleTouchMove as EventListener);
      canvas.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [gameState, score]);
  
  // Separate effect for countdown
  useEffect(() => {
    if (gameState !== 'countdown') return;
    
    console.log("Countdown started:", countdown);
    
    // Reset movement flags when countdown starts
    if (playerRef.current) {
      playerRef.current.isMovingUp = false;
      playerRef.current.isMovingDown = false;
      playerRef.current.isMovingLeft = false;
      playerRef.current.isMovingRight = false;
      playerRef.current.isShooting = false;
      
      // Reset player position
      playerRef.current.x = 200;
      playerRef.current.y = 250;
    }
    
    // Clear zombies and enemy fireballs when countdown starts
    gameStateRef.current.zombies = [];
    gameStateRef.current.enemyFireballs = [];
    
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
  
  // Add an additional event listener cleanup to the window object
  useEffect(() => {
    // Global key handler to reset movement if keys are still pressed when game state changes
    const resetKeysOnStateChange = (e: KeyboardEvent) => {
      if (gameState !== 'playing' && playerRef.current) {
        playerRef.current.isMovingUp = false;
        playerRef.current.isMovingDown = false;
        playerRef.current.isMovingLeft = false;
        playerRef.current.isMovingRight = false;
        playerRef.current.isShooting = false;
      }
    };
    
    window.addEventListener('keyup', resetKeysOnStateChange);
    return () => {
      window.removeEventListener('keyup', resetKeysOnStateChange);
    };
  }, [gameState]);
  
  const startGame = () => {
    console.log("Starting game...");
    
    // Reset game state
    gameStateRef.current.zombies = [];
    gameStateRef.current.enemyFireballs = [];
    gameStateRef.current.zombiesKilled = 0;
    gameStateRef.current.currentWaveSize = 1;
    gameStateRef.current.gameStartTime = Date.now();
    
    // Reset player movement flags
    if (playerRef.current) {
      playerRef.current.isMovingUp = false;
      playerRef.current.isMovingDown = false;
      playerRef.current.isMovingLeft = false;
      playerRef.current.isMovingRight = false;
      playerRef.current.isShooting = false;
      playerRef.current.fireballs = [];
    }
    
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
    
    // Reset player movement flags
    if (playerRef.current) {
      playerRef.current.isMovingUp = false;
      playerRef.current.isMovingDown = false;
      playerRef.current.isMovingLeft = false;
      playerRef.current.isMovingRight = false;
      playerRef.current.isShooting = false;
      playerRef.current.fireballs = [];
    }
    
    setScore(0);
    setLives(4);
    setGameState('playing');
  };
  
  return (
    <div 
      className="bg-black relative"
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* ULTRA MODERN GLASSMORPHISM HEADER */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 50,
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div 
          style={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: '16px 40px'
          }}
        >
          {/* Left side - Lives */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="flex flex-row items-center" style={{ display: 'flex', flexDirection: 'row' }}>
              {Array.from({ length: lives }).map((_, index) => (
                <div key={index} className="inline-block" style={{ width: '32px', height: '32px', marginRight: '8px', display: 'inline-block' }}>
                  <Image 
                    src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                    alt="Life"
                    width={32}
                    height={32}
                    unoptimized={true}
                    style={{ display: 'inline-block', filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))' }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Center - AMMOCAT Title */}
          <div className="text-center">
            <span 
              style={{
                color: '#000000',
                fontSize: '22px',
                fontWeight: '900',
                letterSpacing: '2px',
                textShadow: '0 0 20px rgba(0, 0, 0, 0.4)'
              }}
            >
              AMMOCAT
            </span>
          </div>
          
          {/* Right side - Home Icon (positioned right) */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center',
              paddingRight: '80px'
            }}
          >
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
                textDecoration: 'none'
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
          </div>
        </div>
      </div>

      {/* Left Sidebar - Clean Minimalistic Controls - HIDDEN ON MOBILE */}
      <div 
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
          minWidth: '200px',
          display: 'none' // Hidden on mobile by default
        }}
        className="hidden md:block" // Show only on medium screens and up
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
            WASD / Arrows to move<br/>
            Spacebar to shoot
          </p>
        </div>
      </div>

      {/* Right Sidebar - Score - HIDDEN ON MOBILE */}
      <div 
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
          textAlign: 'center',
          display: 'none' // Hidden on mobile by default
        }}
        className="hidden md:block" // Show only on medium screens and up
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
            SCORE
          </h3>
          <p 
            style={{
              color: '#B91C1C',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}
          >
            {score}
          </p>
        </div>
      </div>

      {/* Mobile Score Display - ONLY VISIBLE ON MOBILE */}
      <div 
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 40,
          background: 'rgba(245, 245, 245, 0.95)',
          borderRadius: '6px',
          padding: '8px 12px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}
        className="block md:hidden" // Show only on mobile
      >
        <p 
          style={{
            color: '#B91C1C',
            fontSize: '16px',
            fontWeight: '700',
            margin: 0,
            lineHeight: 1
          }}
        >
          {score}
        </p>
      </div>

      {/* Mobile Controls Hint - ONLY VISIBLE ON MOBILE */}
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          background: 'rgba(245, 245, 245, 0.95)',
          borderRadius: '6px',
          padding: '8px 16px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}
        className="block md:hidden" // Show only on mobile
      >
        <p 
          style={{
            color: '#666666',
            fontSize: '12px',
            margin: 0,
            lineHeight: 1.2
          }}
        >
          Drag to move • Tap to shoot
        </p>
      </div>

      {/* Game Canvas Container - CENTERED AND MOBILE RESPONSIVE */}
      <div 
        className="relative"
        style={{
          marginTop: '80px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          background: '#f5f5f5',
          maxWidth: '100vw',
          maxHeight: 'calc(100vh - 160px)'
        }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className={`bg-white ${hitEffect ? 'opacity-70' : ''}`}
          style={{
            display: 'block',
            filter: hitEffect ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 0.8))' : 'none',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto'
          }}
        />
        
        {hitEffect && (
          <div className="absolute inset-0 bg-red-500/20 pointer-events-none border-2 border-red-500" />
        )}
        
        {gameState === 'ready' && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: '#f5f5f5',
              border: '1px solid #e0e0e0'
            }}
          >
            {/* Floating Character Asset */}
            <div 
              className="floating-character"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                alt="Character"
                width={120}
                height={120}
                style={{ 
                  objectFit: 'contain',
                  opacity: 0.6,
                  filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))',
                  width: '120px',
                  height: '120px'
                }}
              />
            </div>

            <h1 
              className="text-5xl font-bold mb-8"
              style={{
                color: '#000000',
                letterSpacing: '2px',
                zIndex: 10,
                position: 'relative'
              }}
            >
              AMMOCAT
            </h1>
            <button
              onClick={startGame}
              style={{
                position: 'relative',
                padding: '16px 48px',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                color: '#000000',
                fontSize: '20px',
                fontWeight: '600',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                marginBottom: '32px',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                zIndex: 10
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
              START GAME
            </button>

            {/* Floating Animation Keyframes */}
            <style jsx>{`
              .floating-character {
                animation: float 3s ease-in-out infinite;
              }
              
              @keyframes float {
                0%, 100% {
                  transform: translate(-50%, -50%) translateY(0px);
                }
                50% {
                  transform: translate(-50%, -50%) translateY(-20px);
                }
              }
            `}</style>
          </div>
        )}
        

        

        

      </div>
      
      {/* Countdown Display - Fixed Position Below Canvas */}
      {gameState === 'countdown' && (
        <div 
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, calc(-50% + 320px))',
            textAlign: 'center',
            color: '#666666',
            fontSize: '14px',
            fontWeight: '600',
            zIndex: 100,
            pointerEvents: 'none'
          }}
        >
          Starting in {countdown}...
        </div>
      )}

      {/* Game Over Display - Fixed Position Below Canvas */}
      {gameState === 'gameover' && (
        <div 
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, calc(-50% + 350px))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 100,
            pointerEvents: 'auto'
          }}
        >
          <p 
            style={{
              color: '#000000',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}
          >
            GAME OVER
          </p>
          <p 
            style={{
              color: '#666666',
              fontSize: '14px',
              margin: '0 0 16px 0'
            }}
          >
            Final Score: <span style={{ color: '#B91C1C', fontWeight: 'bold' }}>{finalScore}</span>
          </p>
          <button
            onClick={restartGame}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              color: '#000000',
              fontWeight: '600',
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
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
            PLAY AGAIN
          </button>
        </div>
      )}

    </div>
  );
} 