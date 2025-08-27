"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function StoryPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Add entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
        <div className="w-full grid grid-cols-3 items-center px-6 py-4">
          <div className="flex items-center justify-start">
            <div className="relative mr-4">
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                alt="AMMOCAT" 
                width={35} 
                height={35}
                className="drop-shadow-lg"
              />
            </div>
            <span className="font-montserrat font-black text-black text-xl tracking-wider mr-10">
              AMMOCAT
            </span>
          </div>
          
          <div></div>
          
          <div className="flex justify-end">
            <Link 
              href="/"
              className="group relative px-6 py-3 bg-black text-white rounded-full font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">Back to Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section - Main Image Front and Center */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Image Container */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative inline-block">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl animate-pulse"></div>
              
              {/* Main Image */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200/50">
                <img 
                  src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs/Ammo%20Cat%20Original.jpg"
                  alt="Ammo Cat"
                  className="w-auto h-auto max-w-2xl max-h-96 object-contain rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Title with Advanced Typography */}
          <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-black to-gray-800 mb-6 tracking-tight">
              Ammo Cat
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content Section - Description & Playback */}
      <div className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className={`grid lg:grid-cols-2 gap-12 items-start transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Left Column - Story Description */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-10 shadow-xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </span>
                  The Story
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50">
                    <p className="font-mono text-xl text-gray-800 leading-relaxed">
                      Ammo cat is enjoying life in his castle
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50">
                    <p className="font-mono text-xl text-gray-800 leading-relaxed">
                      when zombie neighbors start launching
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50">
                    <p className="font-mono text-xl text-gray-800 leading-relaxed">
                      rockets at him and his friends!
                    </p>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl text-center">
                <div className="font-mono text-lg text-gray-700">
                  <span>©2025 Ammo Cat. All rights reserved. | </span>
                  <a 
                    href="https://haven.engineer" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-black underline decoration-2 decoration-gray-400 hover:decoration-black transition-all duration-300"
                  >
                    Haven
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Advanced Audio Player */}
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-10 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
                <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-4 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
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

              {/* Advanced Play Button */}
              <div className="text-center mb-8">
                <button
                  onClick={handlePlayPause}
                  className={`group relative w-24 h-24 rounded-full transition-all duration-500 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
                    isPlaying 
                      ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-2xl shadow-red-500/30' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30'
                  }`}
                >
                  {isPlaying ? (
                    <svg className="w-12 h-12 text-white transform transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-12 h-12 text-white ml-1 transform transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                  
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75"></div>
                </button>
              </div>

              {/* Advanced Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${(currentTime / (duration || 1)) * 100}%, #e5e7eb ${(currentTime / (duration || 1)) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Audio Controls */}
              <div className="grid grid-cols-2 gap-4">
                <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-all duration-200 hover:scale-105">
                  <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
                  Loop
                </button>
                <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-all duration-200 hover:scale-105">
                  <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Shuffle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for slider */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6);
        }
      `}</style>
    </div>
  );
}
