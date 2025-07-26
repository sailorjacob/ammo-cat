"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import ArtModal from "@/components/ArtModal";

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
          <ProductCard 
            imageSrc="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs//IMG_2628%20(1).jpg"
                alt="Limited Art Print Series I"
            title="Art Print 1 - Series I"
            description="Limited edition art print"
            limit="Limited to 800 total prints"
            price="$1500"
            stripeLink="https://buy.stripe.com/5kQdRa2PhfmcaZ159x57W03"
            isAvailable={true}
            onClick={() => setShowArtModal(1)}
          />
          <ProductCard 
            imageSrc="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//print22.jpeg"
                alt="Limited Art Print Series II"
            title="Art Print 2 - Series II"
            description="Limited edition art print"
            limit="Limited to 800 total prints"
            price="$1500"
            stripeLink="https://buy.stripe.com/4gMaEY89B8XO2sv0Th57W04"
            isAvailable={true}
            onClick={() => setShowArtModal(2)}
          />
          <ProductCard 
            imageSrc="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//best-2.png"
                alt="Limited Art Print Series III"
            title="Art Print 3 - Series III"
            description="Limited edition art print"
            limit="Limited to 800 total prints"
            price="$1500"
            stripeLink="https://buy.stripe.com/cNidRafC31vm6IL45t57W05"
            isAvailable={true}
            onClick={() => setShowArtModal(3)}
          />
          <ProductCard 
            imageSrc="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                alt="Art Print Series IV"
            title="Art Print 4 - Series IV"
            description="Limited edition hero collection"
            limit=""
            price="COMING SOON"
            isAvailable={false}
            isHero={true}
          />
          <ProductCard 
            imageSrc="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png"
                alt="Art Print Series V"
            title="Art Print 5 - Series V"
            description="Limited edition tactical warfare art collection"
            limit=""
            price="COMING SOON"
            isAvailable={false}
            isHero={true}
          />
          <ProductCard 
            imageSrc="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64zomb2.png"
                alt="Art Print Series VI"
            title="Art Print 6 - Series VI"
            description="Limited edition character collection"
            limit=""
            price="COMING SOON"
            isAvailable={false}
            isHero={true}
          />
        </div>
      </div>

      {/* Art Print Modals */}
      {showArtModal !== null && (
        <ArtModal 
          imageSrc={showArtModal === 1 ? "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs//IMG_2628%20(1).jpg" : showArtModal === 2 ? "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//print22.jpeg" : "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//best-2.png"}
          alt={`Limited Art Print Series ${showArtModal}`}
          title={`Art Print ${showArtModal} - Series ${showArtModal === 1 ? 'I' : showArtModal === 2 ? 'II' : 'III'}`}
          specs={[
            "• Limited fine art print",
            "• 8\" × 10\" dimensions",
            "• Premium fine art paper",
            "• Museum-quality archival inks",
            "• Limited to 800 total prints",
            "• Numbered and authenticated"
          ]}
          about="This exclusive limited edition fine art print is meticulously crafted on premium fine art paper using museum-quality archival inks. Each print is individually numbered and comes with a certificate of authenticity, making it a valuable collector's item."
          price="$1500"
          stripeLink={showArtModal === 1 ? "https://buy.stripe.com/5kQdRa2PhfmcaZ159x57W03" : showArtModal === 2 ? "https://buy.stripe.com/4gMaEY89B8XO2sv0Th57W04" : "https://buy.stripe.com/cNidRafC31vm6IL45t57W05"}
          onClose={() => setShowArtModal(null)}
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
              className="font-sora"
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
              className="font-sora font-bold"
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
              PLAY
            </Link>

            {/* SHOP Button */}
            <button 
              onClick={() => setCurrentView('shop')}
              className="font-sora font-bold"
              style={{
                padding: '12px 24px',
                background: isGlassMode ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
                border: isGlassMode ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #e0e0e0',
                borderRadius: isGlassMode ? '50px' : '8px',
                color: isGlassMode ? '#ffffff' : '#000000',
                fontSize: '16px',
                letterSpacing: '1px',
                cursor: 'pointer',
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
              SHOP
            </button>

            {/* PVP Button */}
            <Link 
              href="/pvp"
              className="font-sora font-bold"
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
              PVP
            </Link>
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

      {/* Background Video - FULL SCREEN */}
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
          autoPlay 
          muted 
          loop 
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
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
