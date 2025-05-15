"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// Coming Soon Page (not a modal)
function ComingSoonPage({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[1000] bg-gradient-to-b from-gray-900 to-black" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000}}>
      <div className="absolute inset-0 flex flex-col items-center justify-center py-10 px-4">
        {/* Back button */}
        <button 
          className="absolute top-6 right-6 text-white hover:text-orange-400 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Gallery Section */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-12">
            {/* Featured Artwork */}
            <div className="relative group">
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm">
                <Image 
                  src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//IMG_16562.jpg"
                  alt="Sniper - Limited Edition Artwork"
                  className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h2 className="text-4xl font-bold text-white mb-2">Sniper</h2>
                    <p className="text-xl text-orange-400 font-medium mb-4">Limited Edition Masterpiece</p>
                    <p className="text-gray-300 mb-6 max-w-xl">
                      A breathtaking masterpiece capturing the essence of tactical precision. This exclusive piece represents the perfect blend of art and tactical excellence, a true collector's item.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-white">$5,000,000,000</span>
                      <button 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-bold text-lg transform transition-all hover:scale-105 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("This is a priceless piece of art. Contact us for acquisition inquiries.");
                        }}
                      >
                        Inquire
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product Card 1 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden group">
                <div className="aspect-square relative">
                  <Image 
                    src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                    alt="Tactical Cat Vest"
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Tactical Cat Vest</h3>
                  <p className="text-gray-400 mb-4">Premium ballistic protection for your feline operative.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-400 font-bold">$599.99</span>
                    <button className="bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
                      Coming Soon
                    </button>
                  </div>
                </div>
        </div>
        
              {/* Product Card 2 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden group">
                <div className="aspect-square relative">
                  <Image 
                    src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png"
                    alt="Laser Sight Collar"
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Laser Sight Collar</h3>
                  <p className="text-gray-400 mb-4">Precision targeting system for night operations.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-400 font-bold">$399.99</span>
                    <button className="bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden group">
                <div className="aspect-square relative">
                  <Image 
                    src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64zomb2.png"
                    alt="Catnip Grenades"
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Catnip Grenades</h3>
                  <p className="text-gray-400 mb-4">Tactical distraction devices for any mission.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-400 font-bold">$249.99</span>
                    <button className="bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
                      Coming Soon
        </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Primary landing page with full screen video
function LandingVideoPage({ onEnterSite }: { onEnterSite: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  return (
    <div 
      className="fixed inset-0 bg-white flex items-center justify-center overflow-hidden" 
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Full-screen background video with scaling */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef}
          className="max-w-[95vw] w-auto h-auto max-h-[75vh] object-contain transform scale-80"
          style={{ maxWidth: '95vw', transform: 'scale(0.8)' }}
          autoPlay 
          playsInline
          muted
          loop
          src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/images//AMMO4.mp4"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 text-center text-black">
        <p className="text-xl md:text-2xl mb-6 max-w-2xl mx-auto">Tactical gear for any mission. Equip for success.</p>
        <h1 className="text-6xl md:text-8xl font-bold mb-8 text-orange-500">AMMO CAT</h1>
        <button 
          onClick={onEnterSite}
          className="bg-orange-500 text-white hover:bg-orange-600 text-xl px-10 py-4 rounded-md font-bold transition-colors"
        >
          Enter Shop
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  // State for site flow
  const [showLanding, setShowLanding] = useState(true);
  const [comingSoonPageOpen, setComingSoonPageOpen] = useState(false);
  
  // Enter site from landing page
  const handleEnterSite = () => {
    setShowLanding(false);
  };

  // Handler for all link/button clicks
  const handleInteraction = (e: React.MouseEvent) => {
    e.preventDefault();
    setComingSoonPageOpen(true);
  };

  return (
    <>
      {/* Initial landing page with full-screen video */}
      {showLanding && (
        <LandingVideoPage onEnterSite={handleEnterSite} />
      )}

      {/* Coming Soon Page replaces entire UI when active */}
      <ComingSoonPage isOpen={comingSoonPageOpen} onClose={() => setComingSoonPageOpen(false)} />
      
      {/* Only show main content if Landing is dismissed and Coming Soon page is not active */}
      {!showLanding && !comingSoonPageOpen && (
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <span 
                  className="font-bold text-2xl text-orange-500 cursor-pointer" 
                  onClick={() => setShowLanding(true)}
                >
                  AMMO CAT
                </span>
            </div>
            <div className="hidden md:flex space-x-8">
                <a href="#" onClick={handleInteraction} className="font-medium text-gray-300 hover:text-orange-500 transition-colors">Home</a>
                <a href="#" onClick={handleInteraction} className="font-medium text-gray-300 hover:text-orange-500 transition-colors">Products</a>
                <a href="#" onClick={handleInteraction} className="font-medium text-gray-300 hover:text-orange-500 transition-colors">About</a>
                <a href="#" onClick={handleInteraction} className="font-medium text-gray-300 hover:text-orange-500 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
                <Link href="/game" className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all hover:scale-105 shadow-md">
                  Play Game
                </Link>
                <button 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all hover:scale-105 shadow-md"
                  onClick={handleInteraction}
                >
                Shop Now
              </button>
            </div>
          </nav>
        </header>

        {/* Main video background - moved to bottom and smaller */}
        <div className="fixed bottom-4 right-4 z-30 pointer-events-none overflow-hidden flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
          <div className="absolute inset-0 bg-black/60 rounded-xl"></div>
          <video 
            autoPlay 
            playsInline
            muted
            loop
            className="w-auto h-auto max-w-full max-h-full object-contain opacity-70"
            style={{ maxWidth: '180px', maxHeight: '180px' }}
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/images//AMMO4.mp4"
          />
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 relative z-10">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">Tactical Gear for Your Strike Force</h1>
              <p className="text-xl mb-8 text-gray-200">Equip with the finest tactical gear. Because every mission matters.</p>
                <button 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg transition-all hover:scale-105 shadow-lg"
                  onClick={handleInteraction}
                >
                View Collection
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                  {/* Placeholder for image - replaced with coming soon */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer" onClick={handleInteraction}>
                  <span className="text-orange-500 font-bold text-2xl">Premium Tactical Gear</span>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white/90 dark:bg-slate-800/90 relative z-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Sniper Artwork */}
              <div className="bg-white dark:bg-slate-700 rounded-xl shadow-xl overflow-hidden transition-transform hover:scale-105 cursor-pointer group relative z-10">
                <div className="aspect-[4/3] relative">
                  <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Image 
                      src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//IMG_16562.jpg"
                      alt="Sniper - Limited Edition Artwork"
                      width={400}
                      height={300}
                      className="object-contain max-w-full max-h-full transform transition-transform duration-700 group-hover:scale-110"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-gray-300 text-sm mb-2">Limited Edition Masterpiece</p>
                      <p className="text-white text-lg font-bold mb-2">A breathtaking tactical artwork</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 relative z-10 bg-white dark:bg-slate-700">
                  <h3 className="font-bold text-2xl mb-2">Sniper</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">A masterpiece capturing the essence of tactical feline precision.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl text-orange-500">$5,000,000,000</span>
                    <button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("This is a priceless piece of art. Contact us for acquisition inquiries.");
                      }}
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>

              {/* Tactical Vest */}
              <div className="bg-white dark:bg-slate-700 rounded-xl shadow-xl overflow-hidden transition-transform hover:scale-105 cursor-pointer group relative z-10">
                <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                  <div className="relative h-full w-full p-4 flex items-center justify-center">
                    <Image 
                      src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//transparentshooter.png"
                      alt="Tactical Vest"
                      width={200}
                      height={200}
                      className="object-contain max-w-full max-h-full transition-transform duration-500 group-hover:scale-110"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  </div>
                </div>
                <div className="p-6 relative z-10 bg-white dark:bg-slate-700">
                  <h3 className="font-bold text-2xl mb-2">Tactical Vest</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Premium ballistic protection for your operative. Level IIIA rated.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl text-orange-500">$599.99</span>
                    <button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setComingSoonPageOpen(true);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Laser Sight Collar */}
              <div className="bg-white dark:bg-slate-700 rounded-xl shadow-xl overflow-hidden transition-transform hover:scale-105 cursor-pointer group relative z-10">
                <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                  <div className="relative h-full w-full p-4 flex items-center justify-center">
                    <Image 
                      src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//zombies%20128x128.png"
                      alt="Laser Sight"
                      width={128}
                      height={128}
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="p-6 relative z-10 bg-white dark:bg-slate-700">
                  <h3 className="font-bold text-2xl mb-2">Laser Sight</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Precision targeting system with night vision capabilities.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl text-orange-500">$399.99</span>
                    <button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setComingSoonPageOpen(true);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Tactical Grenades */}
              <div className="bg-white dark:bg-slate-700 rounded-xl shadow-xl overflow-hidden transition-transform hover:scale-105 cursor-pointer group relative z-10">
                <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                  <div className="relative h-full w-full p-4 flex items-center justify-center">
                    <Image 
                      src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//64x64zomb2.png"
                      alt="Tactical Grenades"
                      width={128}
                      height={128}
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="p-6 relative z-10 bg-white dark:bg-slate-700">
                  <h3 className="font-bold text-2xl mb-2">Tactical Grenades</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Tactical distraction devices with enhanced formula.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl text-orange-500">$249.99</span>
                    <button 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setComingSoonPageOpen(true);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-100/90 dark:bg-slate-900/90 relative z-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Why Choose Ammo Cat?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                  <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer" onClick={handleInteraction}>
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Premium Quality</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-4">All our products are made with the highest quality materials for durability.</p>
              </div>
              <div className="text-center">
                  <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer" onClick={handleInteraction}>
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Expert-Approved Design</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-4">Designed with input from tactical experts for maximum comfort.</p>
              </div>
              <div className="text-center">
                  <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer" onClick={handleInteraction}>
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-bold text-xl mb-2">100% Satisfaction</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-4">If you aren&apos;t satisfied, we offer a full money-back guarantee.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800/95 text-white py-10 mt-auto relative z-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="font-bold text-2xl mb-2">AMMO CAT</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">Premium Tactical Gear - Not for cats. Our advanced equipment is designed for the most demanding tactical operations.</p>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
              <p>&copy; {new Date().getFullYear()} Ammo Cat. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
      )}
    </>
  );
}
