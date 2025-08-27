"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function StoryPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <div className="p-6">
        <Link 
          href="/"
          className="inline-flex items-center text-black hover:text-gray-600 transition-colors duration-200"
        >
          <svg 
            className="w-6 h-6 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Background image - simple and clean */}
      <div className="flex justify-center items-center mb-8">
        <img 
          src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs/Ammo%20Cat%20Original.jpg"
          alt="Ammo Cat"
          className="max-w-2xl w-full h-auto"
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center px-6 text-center">
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold text-black mb-8">
          Ammo Cat
        </h1>

        {/* Audio Player */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-12 shadow-sm max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Audio Story</h2>
          
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          >
            <source 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/ammocat1.mp3" 
              type="audio/mpeg" 
            />
            Your browser does not support the audio element.
          </audio>

          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center mb-4 transition-colors duration-200 mx-auto"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Story Text */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm max-w-2xl">
          <div className="font-mono text-lg md:text-xl text-black leading-relaxed space-y-2">
            <p>Ammo cat is enjoying life in his castle</p>
            <p>when zombie neighbors start launching</p>
            <p>rockets at him and his friends!</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-8">
          <div className="font-mono text-sm md:text-base text-black">
            <span>©2025 Ammo Cat. All rights reserved. | </span>
            <a 
              href="https://haven.engineer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            >
              Haven
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
