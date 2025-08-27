"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

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
      {/* Fixed Header - Same as Homepage */}
      <div 
        className="fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm"
        style={{
          background: '#f5f5f5',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div 
          className="w-full grid grid-cols-3 items-center px-5 py-4"
          style={{ minHeight: '70px' }}
        >
          {/* Left side - Logo + Title */}
          <div className="flex items-center justify-start">
            <div className="relative mr-4">
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                alt="AMMOCAT" 
                width={35} 
                height={35}
              />
            </div>
            <span 
              className="font-montserrat font-bold text-black text-xl font-black tracking-wider mr-10"
            >
              AMMOCAT
            </span>
          </div>
          
          {/* Center - Empty for grid spacing */}
          <div></div>
          
          {/* Right side - Back to Home */}
          <div className="flex justify-end">
            <Link 
              href="/"
              className="font-montserrat font-bold px-4 py-2 bg-white border border-gray-200 rounded-lg text-black text-sm tracking-wide text-decoration-none transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Below Header */}
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-bold text-black mb-8">
              Ammo Cat
            </h1>
          </div>

          {/* Audio Player Section - Positioned Better */}
          <div className="max-w-md mx-auto mb-16">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
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
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #000000 0%, #000000 ${(currentTime / (duration || 1)) * 100}%, #e5e7eb ${(currentTime / (duration || 1)) * 100}%, #e5e7eb 100%)`
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
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="font-mono text-xl md:text-2xl text-black leading-relaxed space-y-4">
                <p>Ammo cat is enjoying life in his castle</p>
                <p>when zombie neighbors start launching</p>
                <p>rockets at him and his friends!</p>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="font-mono text-base text-gray-700">
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
      </div>
    </div>
  );
}
