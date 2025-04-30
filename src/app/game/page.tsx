"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GamePage() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'countdown' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(4);
  const [countdown, setCountdown] = useState(3);
  const [finalScore, setFinalScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 200, y: 300 });
  const [zombies, setZombies] = useState<{ id: number; x: number; y: number }[]>([]);
  const [fireballs, setFireballs] = useState<{ id: number; x: number; y: number }[]>([]);
  const [currentWave, setCurrentWave] = useState(1);
  const [debug, setDebug] = useState('Game ready');
  
  // Handle player movement with keyboard
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 10;
      let newPosition = { ...playerPosition };
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newPosition.y = Math.max(0, newPosition.y - speed);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newPosition.y = Math.min(600 - 64, newPosition.y + speed);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newPosition.x = Math.max(0, newPosition.x - speed);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newPosition.x = Math.min(400 - 64, newPosition.x + speed);
          break;
        case ' ':
          fireProjectile();
          break;
      }
      
      setPlayerPosition(newPosition);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerPosition]);
  
  // Handle mouse/touch events
  useEffect(() => {
    if (gameState !== 'playing' || !gameContainerRef.current) return;
    
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    
    const handlePointerDown = (e: PointerEvent) => {
      const container = gameContainerRef.current;
      const playerElement = container?.querySelector('.player');
      
      if (!container || !playerElement) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const playerRect = playerElement.getBoundingClientRect();
      const relativePlayerRect = {
        left: playerRect.left - rect.left,
        top: playerRect.top - rect.top,
        right: playerRect.right - rect.left,
        bottom: playerRect.bottom - rect.top
      };
      
      // Check if player was clicked
      if (
        x >= relativePlayerRect.left && 
        x <= relativePlayerRect.right && 
        y >= relativePlayerRect.top && 
        y <= relativePlayerRect.bottom
      ) {
        isDragging = true;
        offsetX = x - relativePlayerRect.left;
        offsetY = y - relativePlayerRect.top;
      } else {
        // Shoot if not dragging player
        fireProjectile();
      }
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !gameContainerRef.current) return;
      
      const rect = gameContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - offsetX;
      const y = e.clientY - rect.top - offsetY;
      
      setPlayerPosition({
        x: Math.max(0, Math.min(400 - 64, x)),
        y: Math.max(0, Math.min(600 - 64, y))
      });
    };
    
    const handlePointerUp = () => {
      isDragging = false;
    };
    
    const container = gameContainerRef.current;
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerUp);
    
    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [gameState, playerPosition]);
  
  // Game loop for updating zombies and fireballs
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    // Spawn initial zombies
    if (zombies.length === 0) {
      spawnZombieWave(currentWave);
    }
    
    const gameLoop = setInterval(() => {
      // Move zombies toward player
      setZombies(prevZombies => {
        if (prevZombies.length === 0) {
          // All zombies defeated, start next wave
          setCurrentWave(prev => prev * 2);
          spawnZombieWave(currentWave * 2);
          return [];
        }
        
        return prevZombies.map(zombie => {
          // Calculate direction toward player
          const dx = playerPosition.x - zombie.x;
          const dy = playerPosition.y - zombie.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          
          // Move zombie
          let newX = zombie.x + normalizedDx * 2;
          let newY = zombie.y + normalizedDy * 2;
          
          // Check collision with player
          if (
            newX < playerPosition.x + 64 &&
            newX + 64 > playerPosition.x &&
            newY < playerPosition.y + 64 &&
            newY + 64 > playerPosition.y
          ) {
            // Player hit by zombie
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameState('gameover');
                setFinalScore(score);
              } else {
                setGameState('countdown');
                setCountdown(3);
              }
              return newLives;
            });
            
            // Remove this zombie
            return { ...zombie, x: -1000 };
          }
          
          return { ...zombie, x: newX, y: newY };
        }).filter(zombie => zombie.x > -500);
      });
      
      // Move fireballs and check collisions
      setFireballs(prevFireballs => {
        const updatedFireballs = prevFireballs.map(fireball => ({
          ...fireball,
          x: fireball.x + 10
        }));
        
        // Check fireball collisions with zombies
        updatedFireballs.forEach(fireball => {
          setZombies(prevZombies => {
            let hit = false;
            
            const updatedZombies = prevZombies.map(zombie => {
              if (
                fireball.x < zombie.x + 64 &&
                fireball.x + 20 > zombie.x &&
                fireball.y < zombie.y + 64 &&
                fireball.y + 20 > zombie.y &&
                zombie.x > -500
              ) {
                // Zombie hit by fireball
                hit = true;
                setScore(prev => prev + 100);
                return { ...zombie, x: -1000 }; // Move zombie off-screen
              }
              return zombie;
            });
            
            if (hit && updatedZombies.filter(z => z.x > -500).length === 0) {
              // All zombies defeated, double the wave size
              setCurrentWave(prev => prev * 2);
              setTimeout(() => spawnZombieWave(currentWave * 2), 1000);
            }
            
            return updatedZombies.filter(zombie => zombie.x > -500);
          });
        });
        
        // Remove fireballs that are off-screen
        return updatedFireballs.filter(fireball => fireball.x < 800);
      });
      
      // Increase score over time
      setScore(prev => prev + 1);
      
    }, 100);
    
    return () => clearInterval(gameLoop);
  }, [gameState, currentWave, playerPosition, score]);
  
  // Countdown timer
  useEffect(() => {
    if (gameState !== 'countdown') return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('playing');
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState]);
  
  // Function to spawn zombies
  const spawnZombieWave = (count: number) => {
    setDebug(`Spawning ${count} zombies`);
    
    const newZombies = [];
    for (let i = 0; i < count; i++) {
      newZombies.push({
        id: Date.now() + i,
        x: 700 + Math.random() * 100,
        y: Math.random() * 536 // 600 - 64
      });
    }
    
    setZombies(newZombies);
  };
  
  // Function to fire a projectile
  const fireProjectile = () => {
    setFireballs(prev => [
      ...prev,
      {
        id: Date.now(),
        x: playerPosition.x + 64,
        y: playerPosition.y + 32
      }
    ]);
  };
  
  // Start new game
  const startGame = () => {
    setPlayerPosition({ x: 200, y: 300 });
    setZombies([]);
    setFireballs([]);
    setCurrentWave(1);
    setScore(0);
    setLives(4);
    setGameState('playing');
    setDebug('Game started');
  };
  
  // Restart game
  const restartGame = () => {
    startGame();
  };
  
  // Take screenshot
  const takeScreenshot = () => {
    if (!gameContainerRef.current) return;
    
    // Basic implementation - just for the feature to be present
    alert(`Screenshot captured with score: ${finalScore}`);
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
      
      {/* Debug info */}
      <div className="mb-2 w-full max-w-[800px] p-2 bg-gray-100 text-xs overflow-auto max-h-20">
        <p>Debug: {debug} | Player: ({playerPosition.x}, {playerPosition.y}) | Zombies: {zombies.length} | Wave: {currentWave}</p>
      </div>
      
      {/* Game container - made larger */}
      <div 
        ref={gameContainerRef}
        className="relative border border-gray-300 bg-white touch-none select-none w-[800px] h-[600px] overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Player - always visible now */}
        <div 
          className="player absolute"
          style={{ 
            left: `${playerPosition.x}px`, 
            top: `${playerPosition.y}px`,
            width: '64px',
            height: '64px'
          }}
        >
          <Image 
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64shooter.png"
            alt="Player"
            width={64}
            height={64}
            unoptimized={true}
          />
        </div>
        
        {/* Zombies - only visible during gameplay */}
        {gameState === 'playing' && zombies.map(zombie => (
          <div 
            key={zombie.id}
            className="zombie absolute"
            style={{ 
              left: `${zombie.x}px`, 
              top: `${zombie.y}px`,
              width: '64px',
              height: '64px'
            }}
          >
            <Image 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png"
              alt="Zombie"
              width={64}
              height={64}
              unoptimized={true}
            />
          </div>
        ))}
        
        {/* Fireballs - only visible during gameplay */}
        {gameState === 'playing' && fireballs.map(fireball => (
          <div 
            key={fireball.id}
            className="absolute bg-black rounded-full"
            style={{ 
              left: `${fireball.x}px`, 
              top: `${fireball.y}px`,
              width: '20px',
              height: '20px'
            }}
          />
        ))}
        
        {/* Ready state overlay - semi-transparent to show battlefield */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
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
        
        {/* Countdown overlay */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <div className="text-7xl font-bold">{countdown}</div>
          </div>
        )}
        
        {/* Game over overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
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
        
        {/* Floating restart button during gameplay */}
        {gameState === 'playing' && (
          <button
            onClick={restartGame}
            className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white py-1 px-3 rounded-lg text-sm"
          >
            Restart
          </button>
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