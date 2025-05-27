"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// Loading screen component that transitions into the main site
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
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
          <nav className="hidden md:block">
            <ul className="flex space-x-10">
              <li><Link href="#about" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">ABOUT</Link></li>
              <li><Link href="#features" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">FEATURES</Link></li>
              <li><Link href="#shop" className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">SHOP</Link></li>
            </ul>
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
            <div className="flex flex-wrap gap-4">
              <button onClick={onEnterGame} className="btn-primary">
                PLAY NOW
              </button>
              <button onClick={onExploreShop} className="btn-secondary">
                EXPLORE SHOP
              </button>
            </div>
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
    </div>
  );
}

// Shop section with modern design
function ShopSection({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient">
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
        <button onClick={onBack} className="text-sm font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          BACK
        </button>
      </header>
      
      {/* Shop content */}
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-2">TACTICAL SHOP</h1>
        <p className="text-gray-400 mb-12">Premium gear for your gaming missions</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Item 1 */}
          <div className="bg-[rgb(var(--gray-dark))] rounded-xl overflow-hidden card-hover">
            <div className="aspect-square relative bg-black/40">
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//IMG_16562.jpg"
                alt="Tactical Art"
                fill
                className="object-cover transform transition-transform duration-700 group-hover:scale-110"
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
                <button className="bg-[rgba(var(--primary),0.2)] hover:bg-[rgba(var(--primary),0.3)] text-[rgb(var(--primary))] px-3 py-1 rounded-full text-sm font-medium transition-colors">
                  DETAILS
                </button>
              </div>
            </div>
          </div>
          
          {/* Item 2 */}
          <div className="bg-[rgb(var(--gray-dark))] rounded-xl overflow-hidden card-hover">
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
                <button className="bg-[rgba(var(--primary),0.2)] hover:bg-[rgba(var(--primary),0.3)] text-[rgb(var(--primary))] px-3 py-1 rounded-full text-sm font-medium transition-colors">
                  DETAILS
                </button>
              </div>
            </div>
          </div>
          
          {/* Item 3 */}
          <div className="bg-[rgb(var(--gray-dark))] rounded-xl overflow-hidden card-hover">
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
                <button className="bg-[rgba(var(--primary),0.2)] hover:bg-[rgba(var(--primary),0.3)] text-[rgb(var(--primary))] px-3 py-1 rounded-full text-sm font-medium transition-colors">
                  DETAILS
                </button>
              </div>
            </div>
          </div>
          
          {/* Item 4 */}
          <div className="bg-[rgb(var(--gray-dark))] rounded-xl overflow-hidden card-hover">
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
                <button className="bg-[rgba(var(--primary),0.2)] hover:bg-[rgba(var(--primary),0.3)] text-[rgb(var(--primary))] px-3 py-1 rounded-full text-sm font-medium transition-colors">
                  DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="mt-20 mb-10">
          <h2 className="text-2xl font-bold mb-10">WHY AMMOCAT GEAR?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/30 p-6 rounded-xl border border-[rgba(var(--primary),0.2)]">
              <div className="w-12 h-12 bg-[rgba(var(--primary),0.2)] rounded-full flex items-center justify-center mb-4">
                <span className="text-[rgb(var(--primary))] font-bold">1</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Premium Quality</h3>
              <p className="text-gray-400 text-sm">Engineered with the finest materials for unmatched durability and performance</p>
            </div>
            <div className="bg-black/30 p-6 rounded-xl border border-[rgba(var(--primary),0.2)]">
              <div className="w-12 h-12 bg-[rgba(var(--primary),0.2)] rounded-full flex items-center justify-center mb-4">
                <span className="text-[rgb(var(--primary))] font-bold">2</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Expert Design</h3>
              <p className="text-gray-400 text-sm">Created by gaming professionals to enhance your tactical experience</p>
            </div>
            <div className="bg-black/30 p-6 rounded-xl border border-[rgba(var(--primary),0.2)]">
              <div className="w-12 h-12 bg-[rgba(var(--primary),0.2)] rounded-full flex items-center justify-center mb-4">
                <span className="text-[rgb(var(--primary))] font-bold">3</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Satisfaction</h3>
              <p className="text-gray-400 text-sm">Guaranteed quality and performance or your money back</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ambient video */}
      <div className="fixed bottom-6 right-6 z-30 pointer-events-none overflow-hidden rounded-xl shadow-lg" style={{ width: '180px', height: '180px' }}>
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
      
      {/* Simple footer */}
      <footer className="py-8 border-t border-[rgba(255,255,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} AMMOCAT Studios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'loading' | 'landing' | 'shop'>('loading');
  
  // Handle initial loading sequence
  useEffect(() => {
    // Disable scroll during loading
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Navigation handlers
  const handleLoadingComplete = () => setCurrentView('landing');
  const handleEnterGame = () => window.location.href = '/game';
  const handleExploreShop = () => setCurrentView('shop');
  const handleBackToLanding = () => setCurrentView('landing');
  
  return (
    <main>
      {currentView === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}
      {currentView === 'landing' && <LandingPage onEnterGame={handleEnterGame} onExploreShop={handleExploreShop} />}
      {currentView === 'shop' && <ShopSection onBack={handleBackToLanding} />}
    </main>
  );
}
