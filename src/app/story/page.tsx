"use client";

import { useState, useRef, useEffect } from "react";
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
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              <svg 
                className="w-5 h-5 mr-2" 
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
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Image */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <img 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs/Ammo%20Cat%20Original.jpg"
              alt="Ammo Cat"
              className="mx-auto max-w-lg w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Ammo Cat
          </h1>
        </div>

        {/* Audio Player Section */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Audio Story
            </h2>
            
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
            <div className="text-center mb-6">
              <button
                onClick={handlePlayPause}
                className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(currentTime / (duration || 1)) * 100}%, #e5e7eb ${(currentTime / (duration || 1)) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">{formatTime(currentTime)}</span>
              <span className="font-medium">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Story Text Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <div className="font-mono text-xl md:text-2xl text-gray-900 leading-relaxed space-y-4 text-center">
              <p>Ammo cat is enjoying life in his castle</p>
              <p>when zombie neighbors start launching</p>
              <p>rockets at him and his friends!</p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
            <div className="font-mono text-base text-gray-700">
              <span>©2025 Ammo Cat. All rights reserved. | </span>
              <a 
                href="https://haven.engineer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 font-medium"
              >
                Haven
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
