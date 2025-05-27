"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// Loading screen component that transitions into the main site
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    // Preload critical images to prevent layout shifts and glitches
    const preloadImages = async () => {
      const imagesToPreload = [
        "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//IMG_16562.jpg",
        "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png",
        "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png",
        "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64zomb2.png"
      ];
      
      const preloadPromises = imagesToPreload.map(src => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve even on error to continue loading
        });
      });
      
      await Promise.all(preloadPromises);
    };
    
    // Start preloading
    preloadImages();
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Fade out then complete
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 1000);
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, [onComplete]);
  
  return (
    <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-32 h-32 mb-10 animate-float">
        <Image 
          src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
          alt="AMMOCAT"
          width={128}
          height={128}
          className="object-contain"
        />
      </div>
      <h1 className="text-4xl font-bold mb-10 text-gradient">AMMOCAT</h1>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-[rgb(var(--primary))]"
          style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
        ></div>
      </div>
      <p className="text-gray-400 text-sm">{Math.floor(progress)}% LOADED</p>
    </div>
  );
}

// Main landing page with immersive design
function LandingPage({ onEnterGame, onExploreShop }: { onEnterGame: () => void, onExploreShop: () => void }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          playsInline
          muted
          loop
          src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//AMMO4.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Image 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png" 
              alt="AMMOCAT" 
              width={40} 
              height={40}
              className="mr-2"
            />
            <span className="font-sora font-bold text-xl tracking-wider">AMMO<span className="text-[rgb(var(--primary))]">CAT</span></span>
          </div>
          <nav className="flex items-center space-x-2">
            <button 
              onClick={onEnterGame} 
              className="px-5 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-[rgba(var(--primary),0.8)] to-[rgba(var(--accent),0.8)] hover:from-[rgb(var(--primary))] hover:to-[rgb(var(--accent))] transition-all duration-300 shadow-[0_2px_10px_rgba(var(--primary),0.3)] hover:shadow-[0_2px_15px_rgba(var(--primary),0.5)]"
            >
              PLAY
            </button>
            <button 
              onClick={onExploreShop} 
              className="px-5 py-1.5 rounded-full text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              SHOP
            </button>
          </nav>
        </header>
        
        {/* Hero section */}
        <div className="flex-1 flex items-center">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
              TACTICAL <span className="text-gradient">GAMING</span> REIMAGINED
            </h1>
            <p className="text-lg text-gray-300 mb-10">
              Experience the ultimate tactical shooter with cutting-edge gameplay and immersive mechanics.
            </p>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute right-10 top-1/3 animate-float" style={{ animationDelay: '0.5s' }}>
          <Image 
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64zomb2.png"
            alt="Floating element"
            width={70}
            height={70}
            className="opacity-70"
          />
        </div>
        <div className="absolute right-40 bottom-1/4 animate-float" style={{ animationDelay: '1s' }}>
          <Image 
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png"
            alt="Floating element"
            width={90}
            height={90}
            className="opacity-70"
          />
        </div>
      </div>
      
      {/* Footer - modern & minimalist */}
      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md border-t border-white/10 bg-black/30 z-10">
        <div className="container mx-auto flex justify-center items-center px-6 py-3">
          <div className="text-xs text-white/50">© {new Date().getFullYear()} AMMOCAT</div>
        </div>
      </div>
    </div>
  );
}

// Shop section with modern design
function ShopSection({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient relative">
      {/* Header */}
      <header className="py-6 px-4 container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image 
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png" 
            alt="AMMOCAT" 
            width={30} 
            height={30}
            className="mr-2"
          />
          <span className="font-sora font-bold text-xl tracking-wider">AMMO<span className="text-[rgb(var(--primary))]">CAT</span></span>
        </div>
        <button 
          onClick={onBack} 
          className="px-5 py-1.5 rounded-full text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          BACK
        </button>
      </header>
      
      {/* Shop content */}
      <div className="container mx-auto px-4 py-10 pb-24">
        <h1 className="text-4xl font-bold mb-2">TACTICAL SHOP</h1>
        <p className="text-gray-400 mb-12">Premium gear for your gaming missions</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Item 1 */}
          <div className="bg-[rgb(var(--gray-dark))] rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(var(--primary),0.15)]">
            <div className="aspect-square relative bg-black/40">
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//IMG_16562.jpg"
                alt="Tactical Art"
                width={500}
                height={500}
                className="object-cover w-full h-full transform transition-transform duration-700 hover:scale-110"
                priority={true}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute top-3 right-3 bg-[rgb(var(--primary))] text-xs font-bold px-2 py-1 rounded">
                PREMIUM
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Tactical Art</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">Limited edition artwork showcasing tactical excellence</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[rgb(var(--primary))]">$5,000,000</span>
                <button className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 backdrop-blur-sm border border-[rgba(var(--primary),0.3)] hover:bg-[rgba(var(--primary),0.1)] hover:border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] transition-all duration-300">
                  DETAILS
                </button>
              </div>
            </div>
          </div>
          
          {/* Item 2 */}
          <div className="bg-[rgb(var(--gray-dark))] rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(var(--primary),0.15)]">
            <div className="aspect-square relative bg-black/40">
              <div className="w-full h-full flex items-center justify-center p-4">
                <Image 
                  src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                  alt="Tactical Vest"
                  width={200}
                  height={200}
                  className="object-contain transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Tactical Vest</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">Level IIIA rated protection for intense gaming sessions</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[rgb(var(--primary))]">$599.99</span>
                <button className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 backdrop-blur-sm border border-[rgba(var(--primary),0.3)] hover:bg-[rgba(var(--primary),0.1)] hover:border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] transition-all duration-300">
                  DETAILS
                </button>
              </div>
            </div>
          </div>
          
          {/* Item 3 */}
          <div className="bg-[rgb(var(--gray-dark))] rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(var(--primary),0.15)]">
            <div className="aspect-square relative bg-black/40">
              <div className="w-full h-full flex items-center justify-center p-4">
                <Image 
                  src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png"
                  alt="Targeting System"
                  width={150}
                  height={150}
                  className="object-contain transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Targeting System</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">Advanced laser targeting with night vision capabilities</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[rgb(var(--primary))]">$399.99</span>
                <button className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 backdrop-blur-sm border border-[rgba(var(--primary),0.3)] hover:bg-[rgba(var(--primary),0.1)] hover:border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] transition-all duration-300">
                  DETAILS
                </button>
              </div>
            </div>
          </div>
          
          {/* Item 4 */}
          <div className="bg-[rgb(var(--gray-dark))] rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(var(--primary),0.15)]">
            <div className="aspect-square relative bg-black/40">
              <div className="w-full h-full flex items-center justify-center p-4">
                <Image 
                  src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64zomb2.png"
                  alt="Tactical Grenades"
                  width={150}
                  height={150}
                  className="object-contain transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">Tactical Grenades</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">Specialized distraction devices with enhanced formula</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[rgb(var(--primary))]">$249.99</span>
                <button className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 backdrop-blur-sm border border-[rgba(var(--primary),0.3)] hover:bg-[rgba(var(--primary),0.1)] hover:border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] transition-all duration-300">
                  DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ambient video */}
      <div className="fixed bottom-16 right-6 z-30 pointer-events-none overflow-hidden rounded-xl shadow-lg" style={{ width: '180px', height: '180px' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <video 
          autoPlay 
          playsInline
          muted
          loop
          className="w-full h-full object-cover opacity-80"
          src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/images/AMMO2.mp4"
        />
      </div>
      
      {/* Footer - flush to bottom */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t border-white/10 bg-black/30">
        <div className="container mx-auto flex justify-center items-center px-6 py-3">
          <div className="text-xs text-white/50">© {new Date().getFullYear()} AMMOCAT</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'loading' | 'landing' | 'shop'>('loading');
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Handle initial loading sequence
  useEffect(() => {
    // Disable scroll during loading
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Ensure images are loaded before showing content
  useEffect(() => {
    if (currentView !== 'loading' && !imagesLoaded) {
      setImagesLoaded(true);
    }
  }, [currentView, imagesLoaded]);
  
  // Check localStorage for view preference after loading
  useEffect(() => {
    if (currentView === 'landing') {
      const savedView = typeof window !== 'undefined' ? localStorage.getItem('ammocat_view') : null;
      if (savedView === 'shop') {
        // Short delay before switching to shop to ensure smooth transition
        setTimeout(() => {
          setCurrentView('shop');
          localStorage.removeItem('ammocat_view'); // Clear the preference
        }, 100);
      }
    }
  }, [currentView]);
  
  // Navigation handlers
  const handleLoadingComplete = () => setCurrentView('landing');
  const handleEnterGame = () => window.location.href = '/game';
  const handleExploreShop = () => setCurrentView('shop');
  const handleBackToLanding = () => setCurrentView('landing');
  
  return (
    <main>
      {currentView === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}
      {currentView === 'landing' && <LandingPage onEnterGame={handleEnterGame} onExploreShop={handleExploreShop} />}
      {currentView === 'shop' && imagesLoaded && <ShopSection onBack={handleBackToLanding} />}
    </main>
  );
}
