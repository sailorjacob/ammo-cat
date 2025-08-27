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
    <div className="min-h-screen bg-white">
      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section with Image */}
        <div className="text-center mb-20">
          <div className="mb-12 flex justify-center">
            <img 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs/Ammo%20Cat%20Original.jpg"
              alt="Ammo Cat"
              className="w-auto h-auto max-w-md max-h-96 object-contain"
            />
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-black mb-12 tracking-tight">
            Ammo Cat
          </h1>
        </div>

        {/* Audio Player Section */}
        <div className="max-w-lg mx-auto mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-3xl p-10 shadow-lg">
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
            <div className="text-center mb-8">
              <button
                onClick={handlePlayPause}
                className="w-24 h-24 bg-gradient-to-br from-black to-gray-800 hover:from-gray-800 hover:to-black rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none shadow-2xl"
              >
                {isPlaying ? (
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-3 bg-gray-300 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-200"
                style={{
                  background: `linear-gradient(to right, #000000 0%, #000000 ${(currentTime / (duration || 1)) * 100}%, #d1d5db ${(currentTime / (duration || 1)) * 100}%, #d1d5db 100%)`
                }}
              />
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Story Text Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center">
            <div className="font-mono text-2xl md:text-3xl text-black leading-relaxed space-y-6 font-medium">
              <p>Ammo cat is enjoying life in his castle</p>
              <p>when zombie neighbors start launching</p>
              <p>rockets at him and his friends!</p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-mono text-lg text-gray-600">
            <span>©2025 Ammo Cat. All rights reserved. | </span>
            <a 
              href="https://haven.engineer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-black underline decoration-gray-400 hover:decoration-black transition-all duration-200"
            >
              Haven
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
