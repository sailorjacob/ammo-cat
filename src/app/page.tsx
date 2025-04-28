"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// Coming Soon Page (not a modal)
function ComingSoonPage({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  
  // Renders as a completely separate page, replacing the entire UI
  return (
    <div className="fixed inset-0 z-[1000] bg-white" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000}}>
      <div className="absolute inset-0 flex flex-col items-center justify-center py-10 px-4">
        {/* Back button */}
        <button 
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Coming Soon text above image */}
        <h1 className="text-5xl md:text-6xl font-bold text-red-600 mb-12">COMING SOON!</h1>
        
        {/* Centered image */}
        <div className="w-full max-w-2xl h-[500px] relative mb-12">
          <Image 
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/images//IMG_2342%202.jpg"
            alt="Coming Soon"
            className="object-contain"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
        
        {/* Optional subtitle */}
        <p className="text-xl text-gray-700 max-w-md text-center">
          We're equipping your feline forces with tactical gear. Stay tuned!
        </p>
        
        {/* Return button at bottom */}
        <button 
          className="mt-12 bg-red-600 hover:bg-red-700 text-white text-xl px-10 py-3 rounded-full font-bold"
          onClick={onClose}
        >
          Return to Site
        </button>
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
          src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/images//AMMO.mp4"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 text-center text-black">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 text-orange-500">AMMO CAT</h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">Tactical gear for your feline force. Equip your cat for any mission.</p>
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
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 shadow-sm">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <span 
                  className="font-bold text-xl text-orange-500 cursor-pointer" 
                  onClick={() => setShowLanding(true)}
                >
                  AMMO CAT
                </span>
            </div>
            <div className="hidden md:flex space-x-6">
                <a href="#" onClick={handleInteraction} className="font-medium hover:text-orange-500 transition-colors">Home</a>
                <a href="#" onClick={handleInteraction} className="font-medium hover:text-orange-500 transition-colors">Products</a>
                <a href="#" onClick={handleInteraction} className="font-medium hover:text-orange-500 transition-colors">About</a>
                <a href="#" onClick={handleInteraction} className="font-medium hover:text-orange-500 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  onClick={handleInteraction}
                >
                Shop Now
              </button>
            </div>
          </nav>
        </header>

        {/* Main video background */}
          <div className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40"></div>
          <video 
            autoPlay 
            playsInline
            muted
            loop
              className="w-auto h-auto max-w-[650px] max-h-[650px] object-contain"
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/images//AMMO2.mp4"
          />
        </div>

        {/* Hero Section */}
        <section className="bg-transparent text-white py-20 relative z-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Tactical Gear for Your Feline Force</h1>
              <p className="text-lg mb-8">Equip your cat with the finest tactical gear. Because every mission matters.</p>
                <button 
                  className="bg-white text-orange-500 hover:bg-gray-100 font-bold py-3 px-6 rounded-md transition-colors"
                  onClick={handleInteraction}
                >
                View Collection
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80 bg-white rounded-full shadow-lg overflow-hidden">
                  {/* Placeholder for cat image - replaced with coming soon */}
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center cursor-pointer" onClick={handleInteraction}>
                  <span className="text-gray-500 font-bold text-xl">Cat Image</span>
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white/90 dark:bg-slate-800/90 relative z-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product Card 1 */}
                <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer" onClick={handleInteraction}>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2">Tactical Cat Vest</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Bulletproof protection for your feline companion.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-500">$59.99</span>
                      <button 
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
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

              {/* Product Card 2 */}
                <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer" onClick={handleInteraction}>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2">Laser Sight Collar</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Precision targeting for nighttime operations.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-500">$39.99</span>
                      <button 
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
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

              {/* Product Card 3 */}
                <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer" onClick={handleInteraction}>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2">Catnip Grenades</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Tactical distraction devices for any mission.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-500">$24.99</span>
                      <button 
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
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
                <h3 className="font-bold text-xl mb-2">Cat-Approved Design</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-4">Designed with input from tactical cat experts for maximum comfort.</p>
              </div>
              <div className="text-center">
                  <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer" onClick={handleInteraction}>
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-bold text-xl mb-2">100% Satisfaction</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-4">If your cat isn&apos;t satisfied, we offer a full money-back guarantee.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800/95 text-white py-10 mt-auto relative z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Ammo Cat</h3>
                <p className="text-gray-300">Premium tactical gear for cats who mean business.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2">
                    <li><a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                    <li><a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">Products</a></li>
                    <li><a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Customer Service</h3>
                <ul className="space-y-2">
                    <li><a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
                    <li><a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">Shipping</a></li>
                    <li><a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">Returns</a></li>
                    <li><a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                    <a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                    <a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">Twitter</a>
                    <a href="#" onClick={handleInteraction} className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Subscribe to our newsletter</h4>
                  <div className="flex">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="px-4 py-2 rounded-l-md flex-grow text-black"
                    />
                      <button 
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-md transition-colors"
                        onClick={handleInteraction}
                      >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
