"use client";

import { useState, useRef } from "react";

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
    <div className="min-h-screen bg-white p-8">
      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto">
        {/* Hero Section with Image */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <img 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs/Ammo%20Cat%20Original.jpg"
              alt="Ammo Cat"
              className="mx-auto max-w-lg w-full h-auto"
            />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-black mb-8">
            Ammo Cat
          </h1>
        </div>

        {/* Audio Player Section */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
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
                className="w-20 h-20 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 focus:outline-none"
              >
                {isPlaying ? (
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
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
                className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #000000 0%, #000000 ${(currentTime / (duration || 1)) * 100}%, #d1d5db ${(currentTime / (duration || 1)) * 100}%, #d1d5db 100%)`
                }}
              />
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Story Text Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="text-center">
            <div className="font-mono text-xl md:text-2xl text-black leading-relaxed space-y-4">
              <p>Ammo cat is enjoying life in his castle</p>
              <p>when zombie neighbors start launching</p>
              <p>rockets at him and his friends!</p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="font-mono text-base text-gray-600">
            <span>©2025 Ammo Cat. All rights reserved. | </span>
            <a 
              href="https://haven.engineer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-black underline transition-colors duration-200"
            >
              Haven
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
