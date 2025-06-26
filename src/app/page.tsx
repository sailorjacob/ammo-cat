"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentView, setCurrentView] = useState<'home' | 'shop'>('home');
  const [isGlassMode, setIsGlassMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [crosshairPos, setCrosshairPos] = useState({ x: 0, y: 0 });
  const [showArtModal, setShowArtModal] = useState<number | null>(null);

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
          {/* Product 1 - Limited Art Print (Available) */}
          <div 
            style={{
              padding: '24px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(0)';
            }}
          >
            <div 
              onClick={() => setShowArtModal(1)}
              style={{
                width: '100%',
                height: '192px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f8f8',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1.02)';
                target.style.background = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1)';
                target.style.background = '#f8f8f8';
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs//IMG_2628%20(1).jpg"
                alt="Limited Art Print Series I"
                width={200}
                height={200}
                style={{ 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  pointerEvents: 'none'
                } as React.CSSProperties}
                unoptimized={true}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
              Art Print 1 - Series I
            </h3>
            <p style={{ color: '#666666', marginBottom: '8px' }}>
              Limited edition art print
            </p>
            <p style={{ color: '#666666', fontSize: '14px', fontWeight: '400', marginBottom: '16px' }}>
              Limited to 800 total prints
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#9CA3AF' }}>$1500</span>
              <a 
                href="https://buy.stripe.com/5kQdRa2PhfmcaZ159x57W03"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#000000',
                  border: 'none',
                  color: '#ffffff',
                  padding: '18px 36px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-block',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#333333';
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#000000';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                BUY NOW
              </a>
            </div>
          </div>

          {/* Product 2 - Art Print Series II (Available) */}
          <div 
            style={{
              padding: '24px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(0)';
            }}
          >
            <div 
              onClick={() => setShowArtModal(2)}
              style={{
                width: '100%',
                height: '192px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f8f8',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1.02)';
                target.style.background = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1)';
                target.style.background = '#f8f8f8';
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//print22.jpeg"
                alt="Limited Art Print Series II"
                width={200}
                height={200}
                style={{ 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  pointerEvents: 'none'
                } as React.CSSProperties}
                unoptimized={true}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
              Art Print 2 - Series II
            </h3>
            <p style={{ color: '#666666', marginBottom: '8px' }}>
              Limited edition art print
            </p>
            <p style={{ color: '#666666', fontSize: '14px', fontWeight: '400', marginBottom: '16px' }}>
              Limited to 800 total prints
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#9CA3AF' }}>$1500</span>
              <a 
                href="https://buy.stripe.com/4gMaEY89B8XO2sv0Th57W04"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#000000',
                  border: 'none',
                  color: '#ffffff',
                  padding: '18px 36px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-block',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#333333';
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#000000';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                BUY NOW
              </a>
            </div>
          </div>

          {/* Product 3 - Art Print Series III (Available) */}
          <div 
            style={{
              padding: '24px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(0)';
            }}
          >
            <div 
              onClick={() => setShowArtModal(3)}
              style={{
                width: '100%',
                height: '192px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f8f8',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1.02)';
                target.style.background = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1)';
                target.style.background = '#f8f8f8';
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//best-2.png"
                alt="Limited Art Print Series III"
                width={200}
                height={200}
                style={{ 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  pointerEvents: 'none'
                } as React.CSSProperties}
                unoptimized={true}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
              Art Print 3 - Series III
            </h3>
            <p style={{ color: '#666666', marginBottom: '8px' }}>
              Limited edition art print
            </p>
            <p style={{ color: '#666666', fontSize: '14px', fontWeight: '400', marginBottom: '16px' }}>
              Limited to 800 total prints
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#9CA3AF' }}>$1500</span>
              <a 
                href="https://buy.stripe.com/cNidRafC31vm6IL45t57W05"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#000000',
                  border: 'none',
                  color: '#ffffff',
                  padding: '18px 36px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-block',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#333333';
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.background = '#000000';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                BUY NOW
              </a>
            </div>
          </div>

          {/* Product 4 - Art Print Series IV (Coming Soon) - Hero Character */}
          <div 
            style={{
              padding: '24px',
              transition: 'all 0.3s ease',
              opacity: 0.7
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(-4px)';
              target.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(0)';
              target.style.opacity = '0.7';
            }}
          >
            <div 
              style={{
                width: '100%',
                height: '192px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                alt="Art Print Series IV"
                width={120}
                height={120}
                style={{ objectFit: 'contain', filter: 'grayscale(50%)' }}
              />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
              Art Print 4 - Series IV
            </h3>
            <p style={{ color: '#666666', marginBottom: '16px' }}>
              Limited edition hero collection
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666666' }}>COMING SOON</span>
              <button 
                disabled
                style={{
                  background: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  color: '#999999',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'not-allowed',
                  transition: 'all 0.3s ease'
                }}
              >
                NOTIFY ME
              </button>
            </div>
          </div>

          {/* Product 5 - Art Print Series V (Coming Soon) - Zombie Character */}
          <div 
            style={{
              padding: '24px',
              transition: 'all 0.3s ease',
              opacity: 0.7
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(-4px)';
              target.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(0)';
              target.style.opacity = '0.7';
            }}
          >
            <div 
              style={{
                width: '100%',
                height: '192px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png"
                alt="Art Print Series V"
                width={120}
                height={120}
                style={{ objectFit: 'contain', filter: 'grayscale(50%)' }}
              />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
              Art Print 5 - Series V
            </h3>
            <p style={{ color: '#666666', marginBottom: '16px' }}>
              Limited edition tactical warfare art collection
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666666' }}>COMING SOON</span>
              <button 
                disabled
                style={{
                  background: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  color: '#999999',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'not-allowed',
                  transition: 'all 0.3s ease'
                }}
              >
                NOTIFY ME
              </button>
            </div>
          </div>

          {/* Product 6 - Art Print Series VI (Coming Soon) - Alt Zombie Character */}
          <div 
            style={{
              padding: '24px',
              transition: 'all 0.3s ease',
              opacity: 0.7
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(-4px)';
              target.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(0)';
              target.style.opacity = '0.7';
            }}
          >
            <div 
              style={{
                width: '100%',
                height: '192px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image 
                src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64zomb2.png"
                alt="Art Print Series VI"
                width={120}
                height={120}
                style={{ objectFit: 'contain', filter: 'grayscale(50%)' }}
              />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
              Art Print 6 - Series VI
            </h3>
            <p style={{ color: '#666666', marginBottom: '16px' }}>
              Limited edition character collection
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666666' }}>COMING SOON</span>
              <button 
                disabled
                style={{
                  background: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  color: '#999999',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'not-allowed',
                  transition: 'all 0.3s ease'
                }}
              >
                NOTIFY ME
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Art Print Modals */}
      {showArtModal === 1 && (
        <div 
          onClick={() => setShowArtModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '900px',
              width: '90vw',
              maxHeight: '70vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowArtModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#999999',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = '#f5f5f5';
                target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = 'transparent';
                target.style.color = '#999999';
              }}
            >
              ×
            </button>

            {/* Modal content */}
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
              {/* Image */}
              <div style={{ flex: '0 0 400px' }}>
                <Image 
                  src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs//IMG_2628%20(1).jpg"
                  alt="Limited Art Print Series I"
                  width={400}
                  height={400}
                  style={{ 
                    objectFit: 'cover',
                    borderRadius: '12px',
                    width: '100%',
                    height: 'auto',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  } as React.CSSProperties}
                  unoptimized={true}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#000000', marginBottom: '20px', letterSpacing: '1px' }}>
                  Art Print 1 - Series I
                </h2>
                
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#000000', marginBottom: '16px' }}>
                    Specifications
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', color: '#666666', lineHeight: '1.8' }}>
                    <div>• Limited fine art print</div>
                    <div>• 8" × 10" dimensions</div>
                    <div>• Premium fine art paper</div>
                    <div>• Museum-quality archival inks</div>
                    <div>• Limited to 800 total prints</div>
                    <div>• Numbered and authenticated</div>
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#000000', marginBottom: '16px' }}>
                    About This Print
                  </h3>
                  <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '16px' }}>
                    This exclusive limited edition fine art print is meticulously crafted on premium 
                    fine art paper using museum-quality archival inks. Each print is individually 
                    numbered and comes with a certificate of authenticity, making it a valuable 
                    collector's item.
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '36px', fontWeight: '900', color: '#9CA3AF', letterSpacing: '-1px' }}>$1500</span>
                    <a 
                      href="https://buy.stripe.com/5kQdRa2PhfmcaZ159x57W03"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#000000',
                        border: 'none',
                        color: '#ffffff',
                        padding: '18px 36px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'inline-block',
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.background = '#333333';
                        target.style.transform = 'translateY(-2px)';
                        target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.background = '#000000';
                        target.style.transform = 'translateY(0)';
                        target.style.boxShadow = 'none';
                      }}
                    >
                      BUY NOW
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showArtModal === 2 && (
        <div 
          onClick={() => setShowArtModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '900px',
              width: '90vw',
              maxHeight: '70vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowArtModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#999999',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = '#f5f5f5';
                target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = 'transparent';
                target.style.color = '#999999';
              }}
            >
              ×
            </button>

            {/* Modal content */}
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
              {/* Image */}
              <div style={{ flex: '0 0 400px' }}>
                <Image 
                  src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//print22.jpeg"
                  alt="Limited Art Print Series II"
                  width={400}
                  height={400}
                  style={{ 
                    objectFit: 'cover',
                    borderRadius: '12px',
                    width: '100%',
                    height: 'auto',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  } as React.CSSProperties}
                  unoptimized={true}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#000000', marginBottom: '20px', letterSpacing: '1px' }}>
                  Art Print 2 - Series II
                </h2>
                
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#000000', marginBottom: '16px' }}>
                    Specifications
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', color: '#666666', lineHeight: '1.8' }}>
                    <div>• Limited fine art print</div>
                    <div>• 8" × 10" dimensions</div>
                    <div>• Premium fine art paper</div>
                    <div>• Museum-quality archival inks</div>
                    <div>• Limited to 800 total prints</div>
                    <div>• Numbered and authenticated</div>
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#000000', marginBottom: '16px' }}>
                    About This Print
                  </h3>
                  <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '16px' }}>
                    This exclusive limited edition fine art print is meticulously crafted on premium 
                    fine art paper using museum-quality archival inks. Each print is individually 
                    numbered and comes with a certificate of authenticity, making it a valuable 
                    collector's item.
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '36px', fontWeight: '900', color: '#9CA3AF', letterSpacing: '-1px' }}>$1500</span>
                    <a 
                      href="https://buy.stripe.com/4gMaEY89B8XO2sv0Th57W04"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#000000',
                        border: 'none',
                        color: '#ffffff',
                        padding: '18px 36px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'inline-block',
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.background = '#333333';
                        target.style.transform = 'translateY(-2px)';
                        target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.background = '#000000';
                        target.style.transform = 'translateY(0)';
                        target.style.boxShadow = 'none';
                      }}
                    >
                      BUY NOW
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showArtModal === 3 && (
        <div 
          onClick={() => setShowArtModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '900px',
              width: '90vw',
              maxHeight: '70vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowArtModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#999999',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = '#f5f5f5';
                target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.background = 'transparent';
                target.style.color = '#999999';
              }}
            >
              ×
            </button>

            {/* Modal content */}
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
              {/* Image */}
              <div style={{ flex: '0 0 400px' }}>
                <Image 
                  src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//best-2.png"
                  alt="Limited Art Print Series III"
                  width={400}
                  height={400}
                  style={{ 
                    objectFit: 'cover',
                    borderRadius: '12px',
                    width: '100%',
                    height: 'auto',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  } as React.CSSProperties}
                  unoptimized={true}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#000000', marginBottom: '20px', letterSpacing: '1px' }}>
                  Art Print 3 - Series III
                </h2>
                
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#000000', marginBottom: '16px' }}>
                    Specifications
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', color: '#666666', lineHeight: '1.8' }}>
                    <div>• Limited fine art print</div>
                    <div>• 8" × 10" dimensions</div>
                    <div>• Premium fine art paper</div>
                    <div>• Museum-quality archival inks</div>
                    <div>• Limited to 800 total prints</div>
                    <div>• Numbered and authenticated</div>
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#000000', marginBottom: '16px' }}>
                    About This Print
                  </h3>
                  <p style={{ color: '#666666', lineHeight: '1.7', fontSize: '16px' }}>
                    This exclusive limited edition fine art print is meticulously crafted on premium 
                    fine art paper using museum-quality archival inks. Each print is individually 
                    numbered and comes with a certificate of authenticity, making it a valuable 
                    collector's item.
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '36px', fontWeight: '900', color: '#9CA3AF', letterSpacing: '-1px' }}>$1500</span>
                    <a 
                      href="https://buy.stripe.com/cNidRafC31vm6IL45t57W05"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#000000',
                        border: 'none',
                        color: '#ffffff',
                        padding: '18px 36px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'inline-block',
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.background = '#333333';
                        target.style.transform = 'translateY(-2px)';
                        target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.background = '#000000';
                        target.style.transform = 'translateY(0)';
                        target.style.boxShadow = 'none';
                      }}
                    >
                      BUY NOW
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
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
              color: '#000000',
              textShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
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
                background: 'linear-gradient(90deg, #00d4ff 0%, #8b5cf6 100%)',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.6)'
              }}
            ></div>
          </div>
          <p 
            className="text-lg font-mono"
            style={{
              color: '#000000',
              textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
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
          {/* Left side - Clean Logo */}
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
              style={{
                color: isGlassMode ? '#ffffff' : '#000000',
                fontSize: '22px',
                fontWeight: '900',
                letterSpacing: '2px',
                transition: 'color 0.3s ease'
              }}
            >
              AMMOCAT
            </span>
          </div>
          
          {/* Center - Enhanced Buttons */}
          <div 
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* PLAY Button */}
            <Link 
              href="/game"
              style={{
                padding: '12px 24px',
                background: isGlassMode ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
                border: isGlassMode ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #e0e0e0',
                borderRadius: isGlassMode ? '50px' : '8px',
                color: isGlassMode ? '#ffffff' : '#000000',
                fontSize: '16px',
                fontWeight: isGlassMode ? '700' : '600',
                letterSpacing: '1px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: isGlassMode ? 'blur(15px)' : 'none',
                boxShadow: isGlassMode ? '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-2px) scale(1.02)';
                if (isGlassMode) {
                  target.style.background = 'rgba(255, 255, 255, 0.35)';
                  target.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                  target.style.boxShadow = '0 12px 40px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                } else {
                  target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                  target.style.background = '#f8f8f8';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0) scale(1)';
                if (isGlassMode) {
                  target.style.background = 'rgba(255, 255, 255, 0.25)';
                  target.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                  target.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                } else {
                  target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  target.style.background = '#ffffff';
                }
              }}
            >
              PLAY
            </Link>

            {/* SHOP Button */}
            <button 
              onClick={() => setCurrentView('shop')}
              style={{
                padding: '12px 24px',
                background: isGlassMode ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
                border: isGlassMode ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #e0e0e0',
                borderRadius: isGlassMode ? '50px' : '8px',
                color: isGlassMode ? '#ffffff' : '#000000',
                fontSize: '16px',
                fontWeight: isGlassMode ? '700' : '600',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: isGlassMode ? 'blur(15px)' : 'none',
                boxShadow: isGlassMode ? '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(-2px) scale(1.02)';
                if (isGlassMode) {
                  target.style.background = 'rgba(255, 255, 255, 0.35)';
                  target.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                  target.style.boxShadow = '0 12px 40px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                } else {
                  target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                  target.style.background = '#f8f8f8';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'translateY(0) scale(1)';
                if (isGlassMode) {
                  target.style.background = 'rgba(255, 255, 255, 0.25)';
                  target.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                  target.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                } else {
                  target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  target.style.background = '#ffffff';
                }
              }}
            >
              SHOP
            </button>
          </div>
          
          {/* Right side - Clean Moon Toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button
              onClick={() => setIsGlassMode(!isGlassMode)}
              title="Toggle Glass Mode"
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
                outline: 'none'
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={isGlassMode ? '#ffffff' : '#666666'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ transition: 'stroke 0.3s ease' }}
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Background Video - ABSOLUTELY CENTERED */}
      <div 
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          style={{
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'cover'
          }}
          src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//AMMO4.mp4"
        />
        <div 
          className="absolute bg-black/40"
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        ></div>
      </div>

      {/* Crosshairs - Above video, below header */}
      {currentView === 'home' && !loading && (
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
