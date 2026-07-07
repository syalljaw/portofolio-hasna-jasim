/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { ArrowRight, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPortfolioData, BioData } from '@/lib/portfolio-store';

const artistVectorSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
    <defs>
      <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23F8D9E8" />
        <stop offset="100%" stop-color="%23DCC6F0" />
      </linearGradient>
      <linearGradient id="sub-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="%23FFFFFF" />
        <stop offset="100%" stop-color="%23E9A8C8" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#hero-grad)" />
    <circle cx="300" cy="400" r="220" fill="url(#sub-grad)" opacity="0.6" />
    <circle cx="300" cy="350" r="120" fill="%23FFFFFF" opacity="0.9" />
    <path d="M150,550 C250,450 350,650 450,550" fill="none" stroke="%23E9A8C8" stroke-width="12" stroke-linecap="round" />
    <path d="M200,600 C280,520 320,680 400,600" fill="none" stroke="%23FFFFFF" stroke-width="6" stroke-linecap="round" />
    <polygon points="300,180 306,200 326,206 306,212 300,232 294,212 274,206 294,200" fill="%23E9A8C8" />
    <polygon points="120,380 123,390 133,393 123,396 120,406 117,396 107,393 117,390" fill="%23FFFFFF" />
    <polygon points="480,280 483,290 493,293 483,296 480,306 477,296 467,293 477,290" fill="%23FFFFFF" />
    <circle cx="300" cy="350" r="60" fill="%23DCC6F0" opacity="0.4" />
    <path d="M250,350 Q300,250 350,350 Q300,450 250,350 Z" fill="%23E9A8C8" opacity="0.8" />
  </svg>
`;
const artistSrc = `data:image/svg+xml;utf8,${artistVectorSVG.trim()}`;

export default function Hero() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; width: string; height: string; top: string; left: string; duration: number }>>([]);
  const [bio, setBio] = useState<BioData | null>(null);

  useEffect(() => {
    // Sparkles generation
    setSparkles([...Array(20)].map((_, i) => ({
      id: i,
      width: Math.random() * 6 + 2 + 'px',
      height: Math.random() * 6 + 2 + 'px',
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      duration: Math.random() * 3 + 2,
    })));

    // Load initial bio
    const data = getPortfolioData();
    setBio(data.bio);

    const handleUpdate = () => {
      setBio(getPortfolioData().bio);
    };

    window.addEventListener('portfolio_store_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_store_updated', handleUpdate);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-br from-ashh-white via-ashh-softpink/20 to-ashh-lavender/20">
      {/* Floating Sparkles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute bg-ashh-accentpink/30 rounded-full blur-[1px]"
            style={{
              width: sparkle.width,
              height: sparkle.height,
              top: sparkle.top,
              left: sparkle.left,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-12 z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block py-1 px-3 rounded-full bg-ashh-white border border-ashh-softpink text-ashh-accentpink text-sm font-semibold tracking-wide mb-6 shadow-sm font-sans"
          >
            Halo! Saya @{bio?.username || 'luaveren'}
          </motion.span>
          <h1 className="font-outfit text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
            {bio?.name || 'Ashh'} <br className="hidden md:block" /> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-ashh-accentpink to-purple-400">{bio?.title ? bio.title.split('&').pop()?.trim() || 'Ilustrator' : 'Ilustrator'}</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto md:mx-0 mb-8 font-light leading-relaxed">
            {bio?.intro || "Menghidupkan imajinasi melalui estetika pastel, garis elegan, dan palet warna dreamy. Mari ciptakan sesuatu yang indah bersama."}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <a href="#gallery" className="group relative px-8 py-3.5 bg-gray-900 text-white rounded-full font-medium overflow-hidden shadow-lg shadow-gray-900/20 transition-transform hover:-translate-y-1 w-full sm:w-auto text-center">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Lihat Galeri <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-ashh-accentpink to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a href="#contact" className="px-8 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm w-full sm:w-auto text-center flex items-center justify-center gap-2">
              <Mail size={18} /> Hubungi Saya
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 relative flex justify-center"
        >
          {/* Aesthetic Frame */}
          <div className="relative w-72 h-96 md:w-96 md:h-[32rem]">
             <div className="absolute inset-0 bg-gradient-to-tr from-ashh-softpink to-ashh-lavender rounded-3xl transform rotate-3 scale-105 opacity-50 blur-lg"></div>
             <div className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white z-10">
                <Image
                  src={bio?.heroUrl || artistSrc}
                  alt={`Artist @${bio?.username || 'luaveren'}`}
                  fill
                  unoptimized
                  referrerPolicy="no-referrer"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
             </div>
             {/* Decorative Elements */}
             <motion.div 
               animate={{ y: [-10, 10, -10] }} 
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute -top-6 -right-6 text-5xl z-20 drop-shadow-md"
             >
               ✨
             </motion.div>
             <motion.div 
               animate={{ y: [10, -10, 10] }} 
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute -bottom-4 -left-4 text-4xl z-20 drop-shadow-md"
             >
               🌸
             </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
