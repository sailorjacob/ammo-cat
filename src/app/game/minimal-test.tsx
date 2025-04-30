"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function MinimalGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing'>('ready');
  
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
    
    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw player as a red square for now
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(100, 250, 64, 64);
    
    console.log("Player drawn");
  }, [gameState]);
  
  const startGame = () => {
    console.log("Starting game...");
    setGameState('playing');
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex items-center justify-between w-full max-w-[800px]">
        <div className="text-2xl font-bold">Simple Ammo Cat</div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 bg-white"
        />
        
        {gameState === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
            <h1 className="text-4xl mb-6">SIMPLE TEST</h1>
            <p className="mb-8 text-center max-w-md">
              This is a minimalist test to see if the canvas draws correctly.
            </p>
            <button
              onClick={startGame}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg text-xl"
            >
              Start Test
            </button>
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