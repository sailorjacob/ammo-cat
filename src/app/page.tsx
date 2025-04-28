"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [introVisible, setIntroVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [whiteFade, setWhiteFade] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Handle loop and white fade transition
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const videoDuration = videoRef.current.duration;
        const currentTime = videoRef.current.currentTime;
        
        // Start white fade 0.5 seconds before video ends
        if (videoDuration - currentTime < 0.5) {
          setWhiteFade(true);
        } else {
          setWhiteFade(false);
        }
      }
    };

    // Reset white fade when video loops
    const handleVideoLoop = () => {
      setWhiteFade(false);
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('seeked', handleVideoLoop);
      
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('seeked', handleVideoLoop);
        if (fadeTimerRef.current) {
          clearTimeout(fadeTimerRef.current);
        }
      };
    }
  }, []);

  const dismissIntro = () => {
    setFadeOut(true);
    fadeTimerRef.current = setTimeout(() => {
      setIntroVisible(false);
    }, 1000); // Match this with the CSS transition duration
  };

  return (
    <>
      {introVisible && (
        <div 
          className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-1000 cursor-pointer ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
          onClick={dismissIntro}
        >
          <div className={`absolute inset-0 bg-white transition-opacity duration-500 ${whiteFade ? 'opacity-60' : 'opacity-0'}`}></div>
          <video 
            ref={videoRef}
            id="intro-video"
            autoPlay 
            playsInline
            muted
            loop
            className="max-w-full max-h-full object-contain"
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/images//AMMO.mp4"
          />
          <div className="absolute bottom-10 left-0 right-0 text-center text-black bg-white/50 py-2">
            Click anywhere to continue
          </div>
        </div>
      )}
      
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 shadow-sm">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-orange-500">AMMO CAT</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="font-medium hover:text-orange-500 transition-colors">Home</Link>
              <Link href="/products" className="font-medium hover:text-orange-500 transition-colors">Products</Link>
              <Link href="/about" className="font-medium hover:text-orange-500 transition-colors">About</Link>
              <Link href="/contact" className="font-medium hover:text-orange-500 transition-colors">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Shop Now
              </button>
            </div>
          </nav>
        </header>

        {/* Main video background */}
        <div className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none">
          <div className="absolute inset-0 bg-black/40"></div>
          <video 
            autoPlay 
            playsInline
            muted
            loop
            className="w-full h-full object-cover"
            src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/images//AMMO2.mp4"
          />
        </div>

        {/* Hero Section */}
        <section className="bg-transparent text-white py-20 relative z-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Tactical Gear for Your Feline Force</h1>
              <p className="text-lg mb-8">Equip your cat with the finest tactical gear. Because every mission matters.</p>
              <button className="bg-white text-orange-500 hover:bg-gray-100 font-bold py-3 px-6 rounded-md transition-colors">
                View Collection
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80 bg-white rounded-full shadow-lg overflow-hidden">
                {/* Placeholder for cat image - replace with actual tactical cat image */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
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
              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2">Tactical Cat Vest</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Bulletproof protection for your feline companion.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-500">$59.99</span>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2">Laser Sight Collar</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Precision targeting for nighttime operations.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-500">$39.99</span>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="bg-white dark:bg-slate-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2">Catnip Grenades</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Tactical distraction devices for any mission.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-500">$24.99</span>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
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
                <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Premium Quality</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-4">All our products are made with the highest quality materials for durability.</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="font-bold text-xl mb-2">Cat-Approved Design</h3>
                <p className="text-gray-800 dark:text-gray-200 mb-4">Designed with input from tactical cat experts for maximum comfort.</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link></li>
                  <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Customer Service</h3>
                <ul className="space-y-2">
                  <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQs</Link></li>
                  <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping</Link></li>
                  <li><Link href="/returns" className="text-gray-300 hover:text-white transition-colors">Returns</Link></li>
                  <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Subscribe to our newsletter</h4>
                  <div className="flex">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="px-4 py-2 rounded-l-md flex-grow text-black"
                    />
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-md transition-colors">
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
    </>
  );
}
