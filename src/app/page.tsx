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
                    <p className="text-xl text-orange-400 font-medium mb-4">Limited Edition Artwork</p>
                    <p className="text-gray-300 mb-6 max-w-xl">
                      Tactical precision artwork representing the blend of art and tactical excellence.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold text-white">$5,000,000,000</span>
                      <button 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-bold text-lg transform transition-all hover:scale-105 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Contact us for acquisition inquiries.");
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
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden" 
      style={{ backgroundColor: '#000000' }}
    >
      {/* Full-screen background video with scaling */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay 
          playsInline
          muted
          loop
          src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat//AMMO4.mp4"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-20 text-center">
        <h1 className="text-7xl md:text-9xl font-bold mb-8 text-white">AMMO <span className="text-orange-500">CAT</span></h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-300">Tactical gear redefined. Gaming excellence unleashed.</p>
        <button 
          onClick={onEnterSite}
          className="bg-orange-500 text-white hover:bg-orange-600 text-xl px-14 py-5 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
        >
          ENTER
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
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg shadow-lg">
          <nav className="container mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span 
                className="font-bold text-3xl cursor-pointer" 
                onClick={() => setShowLanding(true)}
              >
                AMMO<span className="text-orange-500">CAT</span>
              </span>
            </div>
            <div className="hidden md:flex space-x-10">
              <a href="#" onClick={handleInteraction} className="font-medium text-gray-300 hover:text-orange-500 transition-colors">Home</a>
              <a href="#" onClick={handleInteraction} className="font-medium text-gray-300 hover:text-orange-500 transition-colors">Products</a>
              <a href="#" onClick={handleInteraction} className="font-medium text-gray-300 hover:text-orange-500 transition-colors">About</a>
              <a href="#" onClick={handleInteraction} className="font-medium text-gray-300 hover:text-orange-500 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/game" className="text-white font-medium py-2 px-6 rounded-full border border-gray-700 hover:border-orange-500 transition-all duration-300 hover:text-orange-500">
                Play Game
              </Link>
              <button 
                className="bg-orange-500 text-white py-2 px-6 rounded-full font-medium transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                onClick={handleInteraction}
              >
                Shop Now
              </button>
            </div>
          </nav>
        </header>

        {/* Main video background - moved to bottom and smaller */}
        <div className="fixed bottom-6 right-6 z-30 pointer-events-none overflow-hidden rounded-2xl shadow-2xl" style={{ width: '180px', height: '180px' }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl"></div>
          <video 
            autoPlay 
            playsInline
            muted
            loop
            className="w-full h-full object-cover opacity-80"
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/images/AMMO2.mp4"
          />
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-black to-gray-900 text-white py-28 relative z-10">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white">Tactical Gear for Your <span className="text-orange-500">Strike Force</span></h1>
              <p className="text-xl mb-10 text-gray-300">Equip with premium tactical gear designed for the modern gaming warrior.</p>
              <button 
                className="bg-orange-500 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-orange-600 hover:scale-105 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                onClick={handleInteraction}
              >
                View Collection
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-96 h-96 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 flex items-center justify-center cursor-pointer" onClick={handleInteraction}>
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
                      <p className="text-gray-300 text-sm mb-2">Limited Edition</p>
                      <p className="text-white text-lg font-bold mb-2">Tactical Artwork</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 relative z-10 bg-white dark:bg-slate-700">
                  <h3 className="font-bold text-2xl mb-2">Sniper</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Precision tactical artwork for collectors.</p>
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
        <footer className="bg-black text-white py-16 mt-auto relative z-20">
          <div className="container mx-auto px-6 text-center">
            <h3 className="font-bold text-3xl mb-4">AMMO<span className="text-orange-500">CAT</span></h3>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">Premium Tactical Gear for the modern gaming warrior.</p>
            <div className="flex justify-center space-x-6 mb-10">
              <a href="#" onClick={handleInteraction} className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" onClick={handleInteraction} className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" onClick={handleInteraction} className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
            <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
              <p>&copy; {new Date().getFullYear()} AmmoCat Studios. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
      )}
    </>
  );
}
