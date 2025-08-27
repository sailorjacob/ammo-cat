"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import HatModal from "@/components/HatModal";
import StickerModal from "@/components/StickerModal";
import BeanieModal from "@/components/BeanieModal";
import ArtModal from "@/components/ArtModal";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentView, setCurrentView] = useState<'home' | 'shop'>('home');
  const [isGlassMode, setIsGlassMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [crosshairPos, setCrosshairPos] = useState({ x: 0, y: 0 });
  const [showArtModal, setShowArtModal] = useState<number | null>(null);
  const [showHatModal, setShowHatModal] = useState<number | null>(null);
  const [showStickerModal, setShowStickerModal] = useState<number | null>(null);
  const [showBeanieModal, setShowBeanieModal] = useState<number | null>(null);
  
  // Video sequence states
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [nextVideoLoaded, setNextVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Video sequence array - 4 videos in sequence for smooth transitions
  const videos = [
    "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//AMMO4.mp4", // Original main homepage video
    "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/zombie11.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3pvbWJpZTExLm1wNCIsImlhdCI6MTc1MzU0MjE3OSwiZXhwIjoyMDY4OTAyMTc5fQ.geM_QilOlb35kiH9qmbZr7JwSfWISgv0P6KKqC_1rHI",
    "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/zombie33.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3pvbWJpZTMzLm1wNCIsImlhdCI6MTc1MzU0MjQ0NSwiZXhwIjoyMDY4OTAyNDQ1fQ.wuhIiwGs-g3pDw46sXM67BU9tXN-VrJhQ5vgN3H2nQE",
    "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/AMMO.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL0FNTU8ubXA0IiwiaWF0IjoxNzUzNTQyNzMxLCJleHAiOjIwNjg5MDI3MzF9.TKEoSRs9QSENIkTVwzTyB69S4LRoct1rkg0ahx6nfts"
  ];

  useEffect(() => {
    // Animate loading progress from 0 to 100
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setLoading(false), 500); // Small delay after reaching 100%
          return 100;
        }
        return prev + Math.random() * 8 + 2; // Smooth random increments
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (currentView === 'home' && !loading) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentView, loading]);

  // Enhanced video transition handler with proper cleanup
  const handleVideoEnd = () => {
    if (isTransitioning) return; // Prevent multiple calls
    
    setIsTransitioning(true);
    
    // Clear any existing timeouts
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    // Smooth transition timing that blends videos together
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      setVideoLoaded(false);
      
      // Allow overlap for seamless blending
      const blendTimeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 800); // Adjusted for better swag timing
      
      return () => clearTimeout(blendTimeout);
    }, 400); // Faster transition start for blending effect
  };

  // Reset video loaded state when video index changes
  useEffect(() => {
    setVideoLoaded(false);
    setNextVideoLoaded(false);
  }, [currentVideoIndex]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Smooth crosshair following effect
  useEffect(() => {
    const smoothFollow = () => {
      setCrosshairPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.08, // Smooth lag factor
        y: prev.y + (mousePos.y - prev.y) * 0.08
      }));
    };

    if (currentView === 'home' && !loading) {
      const animationFrame = requestAnimationFrame(smoothFollow);
      const interval = setInterval(smoothFollow, 16); // ~60fps
      
      return () => {
        cancelAnimationFrame(animationFrame);
        clearInterval(interval);
      };
    }
  }, [mousePos, currentView, loading]);

  // Mobile video autoplay optimization - single video element
  useEffect(() => {
    if (!loading && currentView === 'home') {
      // Force play on mobile devices for the current video only
      const playVideo = async () => {
        const videoElement = document.querySelector('video[src]') as HTMLVideoElement;
        if (videoElement) {
          try {
            await videoElement.play();
          } catch (error) {
            console.log('Video autoplay prevented:', error);
          }
        }
      };

      // Delay to ensure video is loaded
      const timer = setTimeout(playVideo, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, currentView, currentVideoIndex]);

  // Simple Shop Component
  const ShopView = () => (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'auto',
        background: '#f5f5f5'
      }}
    >
             {/* CLEAN SHOP HEADER */}
       <div 
         style={{
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           width: '100%',
           zIndex: 50,
           background: '#f5f5f5',
           borderBottom: '1px solid #e0e0e0',
           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
         }}
       >
         <div 
           style={{ 
             width: '100%',
             display: 'grid',
             gridTemplateColumns: '1fr auto 1fr',
             alignItems: 'center',
             padding: '16px 20px',
             maxWidth: '100vw',
             boxSizing: 'border-box',
             minHeight: '70px'
           }}
         >
           {/* Left side - Back Arrow + Logo */}
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
             <button 
               onClick={() => setCurrentView('home')}
               style={{
                 background: 'transparent',
                 border: 'none',
                 cursor: 'pointer',
                 padding: '8px',
                 borderRadius: '50%',
                 transition: 'all 0.3s ease',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 marginRight: '12px',
                 opacity: 0.8,
                 outline: 'none'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.opacity = '1';
                 e.currentTarget.style.transform = 'scale(1.1)';
                 e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.opacity = '0.8';
                 e.currentTarget.style.transform = 'scale(1)';
                 e.currentTarget.style.background = 'transparent';
               }}
             >
               <svg 
                 xmlns="http://www.w3.org/2000/svg" 
                 width="20" 
                 height="20" 
                 viewBox="0 0 24 24" 
                 fill="none" 
                 stroke="#000000" 
                 strokeWidth="2" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
               >
                 <path d="m15 18-6-6 6-6"/>
               </svg>
             </button>
             
             <button 
               onClick={() => setCurrentView('home')}
               style={{
                 background: 'transparent',
                 border: 'none',
                 cursor: 'pointer',
                 display: 'flex',
                 alignItems: 'center',
                 padding: '4px',
                 borderRadius: '6px',
                 transition: 'all 0.3s ease',
                 outline: 'none'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.background = 'transparent';
               }}
             >
               <Image 
                 src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                 alt="AMMOCAT" 
                 width={32} 
                 height={32}
               />
             </button>
           </div>

           {/* Center - SHOP Title */}
           <div className="text-center">
             <span 
               style={{
                 color: '#000000',
                 fontSize: '22px',
                 fontWeight: '900',
                 letterSpacing: '2px'
               }}
             >
               SHOP
             </span>
           </div>
           
           {/* Right side - Home Icon */}
           <div 
             style={{ 
               display: 'flex', 
               justifyContent: 'flex-end', 
               alignItems: 'center'
             }}
           >
             <button
               onClick={() => setCurrentView('home')}
               style={{
                 background: 'transparent',
                 border: 'none',
                 cursor: 'pointer',
                 padding: '8px',
                 borderRadius: '50%',
                 transition: 'all 0.3s ease',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 opacity: 0.8,
                 outline: 'none'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.opacity = '1';
                 e.currentTarget.style.transform = 'scale(1.1)';
                 e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.opacity = '0.8';
                 e.currentTarget.style.transform = 'scale(1)';
                 e.currentTarget.style.background = 'transparent';
               }}
             >
               <svg 
                 xmlns="http://www.w3.org/2000/svg" 
                 width="24" 
                 height="24" 
                 viewBox="0 0 24 24" 
                 fill="#000000" 
                 stroke="none"
               >
                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                 <polyline points="9 22 9 12 15 12 15 22"></polyline>
               </svg>
             </button>
           </div>
         </div>
       </div>

      {/* Shop Content */}
      <div style={{ paddingTop: '80px', padding: '80px 40px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        </div>

        {/* Products Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          <ProductCard 
            imageSrc="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/print1frame.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3ByaW50MWZyYW1lLnBuZyIsImlhdCI6MTc1NDAwMzkwOCwiZXhwIjoxNzg1NTM5OTA4fQ.LX-jv8i6_yls1HtW9qZvmFcd_ZRjf7xgsD8WfEtuZ_c"
                alt="ammo cat - 10x10 framed"
            title="ammo cat - 10x10 framed"
            description="Limited edition framed art print"
            limit=""
            price="$1500"
            stripeLink="https://buy.stripe.com/cNidRafC31vm6IL45t57W05"
            isAvailable={true}
            onClick={() => setShowArtModal(1)}
          />
          <ProductCard 
            imageSrc="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/print2frame.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3ByaW50MmZyYW1lLnBuZyIsImlhdCI6MTc1NDAwMzkxNywiZXhwIjoxNzg1NTM5OTE3fQ.T7pUJnT78CwvdYhVpqd7UWifuRmVqNR2coe_4-3-4y0"
                alt="alt character - 11x14 framed"
            title="alt character - 11x14 framed"
            description="Limited edition framed art print"
            limit=""
            price="$1500"
            stripeLink="https://buy.stripe.com/4gMaEY89B8XO2sv0Th57W04"
            isAvailable={true}
            onClick={() => setShowArtModal(2)}
          />
          <ProductCard 
            imageSrc="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/print3frame.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3ByaW50M2ZyYW1lLnBuZyIsImlhdCI6MTc1NDAwMzkzMiwiZXhwIjoxNzg1NTM5OTMyfQ.xd1IArLg8_G_oDXGz0_QV8k3p-SDrNwewwny1PxBFZY"
                alt="zombie - 12x16 framed"
            title="zombie - 12x16 framed"
            description="Limited edition framed art print"
            limit=""
            price="$1500"
            stripeLink="https://buy.stripe.com/5kQdRa2PhfmcaZ159x57W03"
            isAvailable={true}
            onClick={() => setShowArtModal(3)}
          />
          <ProductCard 
            imageSrc="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/hat1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL2hhdDEucG5nIiwiaWF0IjoxNzUzODcxNzgxLCJleHAiOjIwNjkyMzE3ODF9.uTsaVZ_eOuVEd7EmzMmt2xFfb8nnK9vOoHOP-zXsNLU"
                alt="Shooter Hat"
            title="Shooter Hat"
            description="Foam Trucker Hat"
            limit="Available now"
            price="$40"
            isAvailable={true}
            onClick={() => setShowHatModal(1)}
          />
          <ProductCard 
            imageSrc="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/zombiehat.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3pvbWJpZWhhdC5wbmciLCJpYXQiOjE3NTM5Nzk2ODUsImV4cCI6MjA2OTMzOTY4NX0.Pyz_Qm37fQ3fXVawIT4GTHqhfMOqeX76zZBXGI0pgLI"
                alt="Zombie Hat"
            title="Zombie Hat"
            description="Foam Trucker Hat"
            limit="Available now"
            price="$40"
            isAvailable={true}
            onClick={() => setShowHatModal(2)}
          />
          <ProductCard 
            imageSrc="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/IMG_5762.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL0lNR181NzYyLlBORyIsImlhdCI6MTc1Mzk4NzI4OSwiZXhwIjoyMDY5MzQ3Mjg5fQ.xnucBoG0W4eVDVmI2kaqLvbXfbIuSB5iJmUNknTL1Aw"
                alt="AMMO Beanie"
            title="AMMO Beanie"
            description="Premium Knit Beanie"
            limit="Available now"
            price="$60"
            isAvailable={true}
            onClick={() => setShowBeanieModal(1)}
          />

          <ProductCard 
            imageSrc="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/sticker.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3N0aWNrZXIucG5nIiwiaWF0IjoxNzUzOTg4MTE4LCJleHAiOjIwNjkzNDgxMTh9.SreqtZ3-1Wg4liN0NF5hFn5mq8zcbsxZ1WcaCBFtI_k"
                alt="Zombie Sticker"
            title="Zombie Sticker"
            description="Kiss Cut Sticker"
            limit="Available now"
            price="$12"
            isAvailable={true}
            onClick={() => setShowStickerModal(1)}
          />
          <ProductCard 
            imageSrc="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/ammosticker.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL2FtbW9zdGlja2VyLnBuZyIsImlhdCI6MTc1NDAwNTYyOCwiZXhwIjoxNzg1NTQxNjI4fQ.YtR7tGcyNpStTPG5Z_fFjXqkGViqRu9juuPpD7IUX9c"
                alt="AMMO Sticker"
            title="AMMO Sticker"
            description="Kiss Cut Sticker"
            limit="Available now"
            price="$12"
            isAvailable={true}
            onClick={() => setShowStickerModal(2)}
          />
          {/* Art Print 5 Series V temporarily hidden for later re-enable */}
        </div>
      </div>

      {/* Minimalistic Footer - Bottom Left */}
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(245, 245, 245, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid rgba(224, 224, 224, 0.5)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          fontSize: '12px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#666666',
          letterSpacing: '0.5px'
        }}
      >
        {/* AMMOCAT Link */}
        <button
          onClick={() => setCurrentView('home')}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 4px',
            borderRadius: '4px',
            color: '#000000',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'rgba(0, 0, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'transparent';
          }}
        >
          🔫 AMMOCAT
        </button>

        <span style={{ color: '#cccccc', fontSize: '10px' }}>→</span>

        {/* PLAY Link */}
        <a
          href="/game"
          style={{
            textDecoration: 'none',
            color: '#666666',
            padding: '2px 4px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'rgba(0, 0, 0, 0.05)';
            target.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'transparent';
            target.style.color = '#666666';
          }}
        >
          PLAY
        </a>

        {/* SHOP - Current page indicator */}
        <span
          style={{
            color: '#000000',
            padding: '2px 4px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            background: 'rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          SHOP
        </span>

        {/* PVP Link */}
        <a
          href="/pvp"
          style={{
            textDecoration: 'none',
            color: '#666666',
            padding: '2px 4px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'rgba(0, 0, 0, 0.05)';
            target.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'transparent';
            target.style.color = '#666666';
          }}
        >
          PVP
        </a>

        <span style={{ color: '#cccccc', fontSize: '8px', margin: '0 4px' }}>
          ──────────
        </span>

        {/* Moon Link to ammocat3000.com */}
        <a
          href="https://ammocat3000.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            padding: '2px 4px',
            borderRadius: '4px',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'rgba(0, 0, 0, 0.05)';
            target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement;
            target.style.background = 'transparent';
            target.style.transform = 'scale(1)';
          }}
        >
          🌙
        </a>
      </div>

      {/* Art Print Modals */}
      {showArtModal !== null && (
        <ArtModal 
          imageSrc={showArtModal === 1 ? "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/print1frame.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3ByaW50MWZyYW1lLnBuZyIsImlhdCI6MTc1NDAwMzkwOCwiZXhwIjoxNzg1NTM5OTA4fQ.LX-jv8i6_yls1HtW9qZvmFcd_ZRjf7xgsD8WfEtuZ_c" : showArtModal === 2 ? "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/print2frame.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3ByaW50MmZyYW1lLnBuZyIsImlhdCI6MTc1NDAwMzkxNywiZXhwIjoxNzg1NTM5OTE3fQ.T7pUJnT78CwvdYhVpqd7UWifuRmVqNR2coe_4-3-4y0" : "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/print3frame.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3ByaW50M2ZyYW1lLnBuZyIsImlhdCI6MTc1NDAwMzkzMiwiZXhwIjoxNzg1NTM5OTMyfQ.xd1IArLg8_G_oDXGz0_QV8k3p-SDrNwewwny1PxBFZY"}
          alt={showArtModal === 1 ? "ammo cat - 10x10 framed" : showArtModal === 2 ? "alt character - 11x14 framed" : "zombie - 12x16 framed"}
          title={showArtModal === 1 ? "ammo cat - 10x10 framed" : showArtModal === 2 ? "alt character - 11x14 framed" : "zombie - 12x16 framed"}
          specs={[
            "• Limited fine art print",
            `• ${showArtModal === 1 ? "10\" × 10\"" : showArtModal === 2 ? "11\" × 14\"" : "12\" × 16\""} dimensions`,
            "• Premium fine art paper",
            "• Museum-quality archival inks", 

            "• Numbered and authenticated",
            "• Ready to hang with included frame"
          ]}
          about="This exclusive limited edition fine art print is meticulously crafted on premium fine art paper using museum-quality archival inks. Each print is individually numbered and comes with a certificate of authenticity, making it a valuable collector's item."
          price="$1500"
          stripeLink={showArtModal === 1 ? "https://buy.stripe.com/cNidRafC31vm6IL45t57W05" : showArtModal === 2 ? "https://buy.stripe.com/4gMaEY89B8XO2sv0Th57W04" : "https://buy.stripe.com/5kQdRa2PhfmcaZ159x57W03"}
          onClose={() => setShowArtModal(null)}
        />
      )}

      {/* Hat Modals */}
      {showHatModal !== null && (
        <HatModal 
          imageSrc={showHatModal === 1 ? "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/hat1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL2hhdDEucG5nIiwiaWF0IjoxNzUzODcxNzgxLCJleHAiOjIwNjkyMzE3ODF9.uTsaVZ_eOuVEd7EmzMmt2xFfb8nnK9vOoHOP-zXsNLU" : "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/zombiehat.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3pvbWJpZWhhdC5wbmciLCJpYXQiOjE3NTM5Nzk2ODUsImV4cCI6MjA2OTMzOTY4NX0.Pyz_Qm37fQ3fXVawIT4GTHqhfMOqeX76zZBXGI0pgLI"}
          alt={showHatModal === 1 ? "Shooter Hat" : "Zombie Hat"}
          title={showHatModal === 1 ? "Shooter Hat" : "Zombie Hat"}
          specs={[
            "• Premium foam trucker hat",
            "• Adjustable snapback closure",
            "• Breathable mesh back panels",
            "• High-quality embroidered design",
            "• One size fits most",
            "• Comfortable foam front"
          ]}
          about={showHatModal === 1 ? "The Shooter Hat combines tactical style with everyday comfort. Featuring premium foam construction and breathable mesh panels, this trucker hat is perfect for range days, outdoor adventures, or casual wear. The adjustable snapback ensures a perfect fit for most head sizes." : "The Zombie Hat brings apocalyptic style to your everyday wardrobe. Built with the same premium foam construction as our Shooter Hat, this design features unique zombie-themed artwork. Perfect for horror fans, gamers, or anyone who wants to stand out from the crowd."}
          price="$40"
          onClose={() => setShowHatModal(null)}
        />
      )}

      {/* Sticker Modals */}
      {showStickerModal !== null && (
        <StickerModal 
          imageSrc={showStickerModal === 1 ? "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/sticker.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3N0aWNrZXIucG5nIiwiaWF0IjoxNzUzOTg4MTE4LCJleHAiOjIwNjkzNDgxMTh9.SreqtZ3-1Wg4liN0NF5hFn5mq8zcbsxZ1WcaCBFtI_k" : "https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/ammosticker.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL2FtbW9zdGlja2VyLnBuZyIsImlhdCI6MTc1NDAwNTYyOCwiZXhwIjoxNzg1NTQxNjI4fQ.YtR7tGcyNpStTPG5Z_fFjXqkGViqRu9juuPpD7IUX9c"}
          alt={showStickerModal === 1 ? "Zombie Sticker" : "AMMO Sticker"}
          title={showStickerModal === 1 ? "Zombie Sticker" : "AMMO Sticker"}
          specs={[
            "• High-quality kiss cut sticker",
            "• Weather-resistant vinyl material",
            "• Vibrant, fade-resistant colors",
            "• Easy peel-and-stick application",
            "• Suitable for indoor/outdoor use",
            "• Approximately 3\" in size"
          ]}
          about={showStickerModal === 1 ? "The Zombie Sticker showcases our apocalyptic character design in high-quality kiss cut vinyl. Built to last with weather-resistant properties, this sticker is perfect for adding some undead style to your gear. Great for horror fans and gamers alike." : "The AMMO Sticker features our iconic character in premium kiss cut vinyl. Perfect for personalizing laptops, water bottles, cars, or any smooth surface. Made with weather-resistant materials that maintain vibrant colors and strong adhesion over time."}
          price="$12"
          onClose={() => setShowStickerModal(null)}
        />
      )}

      {/* Beanie Modal */}
      {showBeanieModal !== null && (
        <BeanieModal 
          imageSrc="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/IMG_5762.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL0lNR181NzYyLlBORyIsImlhdCI6MTc1Mzk4NzI4OSwiZXhwIjoyMDY5MzQ3Mjg5fQ.xnucBoG0W4eVDVmI2kaqLvbXfbIuSB5iJmUNknTL1Aw"
          alt="AMMO Beanie"
          title="AMMO Beanie"
          specs={[
            "• Premium knit construction",
            "• 100% acrylic yarn material",
            "• Soft fleece-lined interior",
            "• Embroidered AMMO logo design",
            "• One size fits most adults",
            "• Warm and comfortable fit"
          ]}
          about="The AMMO Beanie combines street style with premium comfort. Crafted from high-quality acrylic yarn with a soft fleece lining, this beanie provides exceptional warmth and comfort. The embroidered AMMO logo adds a tactical aesthetic perfect for cold weather adventures, urban exploration, or everyday wear."
          price="$60"
          onClose={() => setShowBeanieModal(null)}
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div 
        className="fixed inset-0 bg-black z-50"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0
        }}
      >
        <div 
          className="text-center"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="w-40 h-40 mb-8 animate-pulse">
            <Image 
              src="https://yhmbwjksmppawaiggznm.supabase.co/storage/v1/object/sign/ammo/trasnparentshooter4.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMzllZDNiMy1kYWMxLTQwOTctODE2Ny00M2MwNTRhNTAwOWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbW1vL3RyYXNucGFyZW50c2hvb3RlcjQucG5nIiwiaWF0IjoxNzUzODcxODE2LCJleHAiOjE3ODU0MDc4MTZ9.Db4-S8L0kPOBXcdLY1ozxaq54iX8N3VTXQopRlCihv4"
              alt="AMMOCAT"
              width={160}
              height={160}
              className="object-contain"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <h1 
            className="text-5xl font-bold mb-6"
            style={{
              color: '#000000'
            }}
          >
            AMMOCAT
          </h1>
          <div 
            className="bg-gray-800 rounded-full mb-4"
            style={{ width: '300px', height: '6px' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${Math.min(loadingProgress, 100)}%`,
                background: 'linear-gradient(90deg, #00d4ff 0%, #8b5cf6 100%)'
              }}
            ></div>
          </div>
          <p 
            className="text-lg"
            style={{
              color: '#000000'
            }}
          >
            {Math.floor(loadingProgress)}%
          </p>
        </div>
      </div>
    );
  }

  // Show shop view if selected
  if (currentView === 'shop') {
    return <ShopView />;
  }

  // Main homepage
  return (
    <div 
      className="bg-black relative"
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* CLEAN GLASSMORPHISM HOMEPAGE HEADER */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 50,
          background: isGlassMode ? 'rgba(0, 0, 0, 0.05)' : '#f5f5f5',
          backdropFilter: isGlassMode ? 'blur(20px)' : 'none',
          borderBottom: isGlassMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e0e0e0',
          boxShadow: isGlassMode ? '0 8px 32px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <div 
          style={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: '16px 20px',
            maxWidth: '100vw',
            boxSizing: 'border-box',
            minHeight: '70px'
          }}
        >
          {/* Left side - Logo + Title + Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <div 
              style={{
                position: 'relative',
                marginRight: '16px'
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                alt="AMMOCAT" 
                width={35} 
                height={35}
              />
            </div>
            <span 
              className="font-montserrat font-bold"
              style={{
                color: isGlassMode ? '#ffffff' : '#000000',
                fontSize: '22px',
                fontWeight: '900',
                letterSpacing: '2px',
                transition: 'color 0.3s ease',
                marginRight: '40px'
              }}
            >
              AMMOCAT
            </span>
            
            {/* Buttons positioned to the right of title */}
            <div 
              style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center'
              }}
            >
              {/* PLAY Button */}
              <Link 
                href="/game"
                className="font-montserrat font-bold"
                style={{
                  padding: '12px 24px',
                  background: isGlassMode ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
                  border: isGlassMode ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #e0e0e0',
                  borderRadius: isGlassMode ? '50px' : '8px',
                  color: isGlassMode ? '#ffffff' : '#000000',
                  fontSize: '16px',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: isGlassMode ? 'blur(15px)' : 'none',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(0)';
                }}
              >
                play
              </Link>

              {/* SHOP Button */}
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView('shop');
                }}
                className="font-montserrat font-bold"
                style={{
                  padding: '12px 24px',
                  background: isGlassMode ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
                  border: isGlassMode ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #e0e0e0',
                  borderRadius: isGlassMode ? '50px' : '8px',
                  color: isGlassMode ? '#ffffff' : '#000000',
                  fontSize: '16px',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: isGlassMode ? 'blur(15px)' : 'none',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(0)';
                }}
              >
                shop
              </a>

              {/* PVP Button */}
              <Link 
                href="/pvp"
                className="font-montserrat font-bold"
                style={{
                  padding: '12px 24px',
                  background: isGlassMode ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
                  border: isGlassMode ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #e0e0e0',
                  borderRadius: isGlassMode ? '50px' : '8px',
                  color: isGlassMode ? '#ffffff' : '#000000',
                  fontSize: '16px',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: isGlassMode ? 'blur(15px)' : 'none',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(0)';
                }}
              >
                pvp
              </Link>

              {/* Story Button */}
              <a 
                href="https://ammocat3000.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-montserrat font-bold"
                style={{
                  padding: '12px 24px',
                  background: isGlassMode ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
                  border: isGlassMode ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #e0e0e0',
                  borderRadius: isGlassMode ? '50px' : '8px',
                  color: isGlassMode ? '#ffffff' : '#000000',
                  fontSize: '16px',
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: isGlassMode ? 'blur(15px)' : 'none',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(0)';
                }}
              >
                story
              </a>
            </div>
          </div>
          
          {/* Center - Empty for proper grid spacing */}
          <div></div>
          
          {/* Right side - Empty for proper grid spacing */}
          <div></div>
        </div>
      </div>

      {/* Background Video - FULL SCREEN with Enhanced Transitions */}
      <div 
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline
          webkit-playsinline="true"
          onEnded={handleVideoEnd}
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlayThrough={() => setVideoLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: videoLoaded && !isTransitioning ? 1 : 0.3,
            transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: isTransitioning ? 'blur(1px) brightness(1.05)' : 'none'
          }}
          src={videos[currentVideoIndex]}
        />
        
        <div 
          className="absolute bg-black/30"
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2
          }}
        ></div>
        
        {/* Enhanced gradient overlay for diamond-like transition effect */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: isTransitioning 
              ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.4) 50%, rgba(0,0,0,0.8) 100%)'
              : 'transparent',
            opacity: isTransitioning ? 1 : 0,
            transition: 'all 1.8s cubic-bezier(0.23, 1, 0.32, 1)',
            zIndex: 3,
            pointerEvents: 'none'
          }}
        />
      </div>



      {/* Crosshairs - Hidden for now */}
      {false && currentView === 'home' && !loading && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          {/* Horizontal line */}
          <div 
            style={{
              position: 'absolute',
              left: 0,
              top: `${crosshairPos.y}px`,
              width: '100vw',
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-0.5px)',
              transition: 'opacity 0.3s ease'
            }}
          />
          {/* Vertical line */}
          <div 
            style={{
              position: 'absolute',
              left: `${crosshairPos.x}px`,
              top: 0,
              width: '1px',
              height: '100vh',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
              transform: 'translateX(-0.5px)',
              transition: 'opacity 0.3s ease'
            }}
          />
        </div>
      )}

      {/* Main Content - ABSOLUTELY CENTERED */}
      <div 
        className="absolute z-20"
        style={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="text-center"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="w-48 h-48 animate-bounce">
            <Image 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
              alt="AMMOCAT"
              width={192}
              height={192}
              className="object-contain drop-shadow-2xl"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Assets - ABSOLUTELY CENTERED HORIZONTAL */}
      <div 
        className="absolute z-20"
        style={{
          bottom: '80px',
          left: 0,
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px'
          }}
        >
          <div className="animate-float">
            <Image 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64zomb2.png"
              alt="Asset 1"
              width={80}
              height={80}
              className="opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110"
            />
          </div>
          <div className="animate-float" style={{animationDelay: '1s'}}>
            <Image 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png"
              alt="Asset 2"
              width={120}
              height={120}
              className="opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110"
            />
          </div>
          <div className="animate-float" style={{animationDelay: '2s'}}>
            <Image 
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
              alt="Asset 3"
              width={80}
              height={80}
              className="opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110"
            />
          </div>
        </div>
      </div>


    </div>
  );
}
