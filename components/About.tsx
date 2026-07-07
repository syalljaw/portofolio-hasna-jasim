/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { getPortfolioData, BioData } from '@/lib/portfolio-store';

const workspaceVectorSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <linearGradient id="work-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23DCC6F0" />
        <stop offset="100%" stop-color="%23F8D9E8" />
      </linearGradient>
      <linearGradient id="inner-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="%23E9A8C8" />
        <stop offset="100%" stop-color="%23FFFFFF" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#work-grad)" />
    <rect x="200" y="250" width="400" height="300" rx="20" fill="url(#inner-grad)" opacity="0.8" />
    <rect x="230" y="280" width="340" height="240" rx="10" fill="%23FFFFFF" opacity="0.9" />
    <path d="M280,450 C330,350 470,350 520,450" fill="none" stroke="%23E9A8C8" stroke-width="8" stroke-linecap="round" />
    <path d="M350,420 Q400,380 450,420" fill="none" stroke="%23DCC6F0" stroke-width="5" stroke-linecap="round" />
    <circle cx="400" cy="350" r="15" fill="%23E9A8C8" />
    <circle cx="460" cy="320" r="8" fill="%23DCC6F0" />
    <polygon points="400,100 410,130 440,140 410,150 400,180 390,150 360,140 390,130" fill="%23FFFFFF" />
    <line x1="400" y1="550" x2="400" y2="650" stroke="%23FFFFFF" stroke-width="12" stroke-linecap="round" />
    <line x1="300" y1="650" x2="500" y2="650" stroke="%23FFFFFF" stroke-width="12" stroke-linecap="round" />
    <circle cx="150" cy="600" r="50" fill="%23FFFFFF" opacity="0.9" />
    <circle cx="130" cy="590" r="12" fill="%23E9A8C8" />
    <circle cx="160" cy="580" r="10" fill="%23DCC6F0" />
    <circle cx="170" cy="610" r="12" fill="%23F8D9E8" />
  </svg>
`;
const workspaceSrc = `data:image/svg+xml;utf8,${workspaceVectorSVG.trim()}`;

export default function About() {
  const [bio, setBio] = useState<BioData | null>(null);

  useEffect(() => {
    const data = getPortfolioData();
    setBio(data.bio);

    const handleUpdate = () => {
      setBio(getPortfolioData().bio);
    };

    window.addEventListener('portfolio_store_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_store_updated', handleUpdate);
  }, []);

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Visual Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative aspect-square max-w-[500px]"
          >
            <div className="absolute inset-0 bg-ashh-softpink rounded-full blur-3xl opacity-30 transform -translate-x-10 translate-y-10"></div>
            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border-8 border-ashh-lightgray">
              <Image
                src={bio?.avatarUrl || workspaceSrc}
                alt="Artist Workspace"
                fill
                unoptimized
                referrerPolicy="no-referrer"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-sm font-bold text-ashh-accentpink tracking-widest uppercase mb-2">Tentang Saya</h2>
            <h3 className="font-outfit text-4xl font-bold text-gray-900 mb-6">Mewujudkan Impian Menjadi Realitas Visual</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {bio?.aboutText1 || "Halo, saya Ashh (@luaveren), seniman digital dan ilustrator yang sangat menyukai estetika pastel lembut dan konsep ethereal. Karya saya menjelajahi perpaduan fantasi dan emosi yang halus, memberikan sentuhan lembut unik pada setiap proyek."}
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {bio?.aboutText2 || "Dengan pengalaman bertahun-tahun dalam lukisan digital, branding, dan ilustrasi konseptual, saya berusaha menciptakan seni yang tidak hanya indah dipandang tetapi juga beresonansi dengan hati."}
            </p>

            <div>
              <h4 className="font-outfit text-lg font-bold text-gray-900 mb-4">Peralatan Kreatif Saya</h4>
              <div className="flex flex-wrap gap-2.5">
                {(bio?.softwares || ['Adobe Photoshop', 'Illustrator', 'Clip Studio Paint', 'Canva', 'Ibis Paint', 'Figma']).map((item) => (
                  <span 
                    key={item}
                    className="px-4 py-2 bg-ashh-lightgray rounded-xl text-xs font-semibold text-gray-700 border border-gray-100 hover:border-ashh-softpink hover:bg-ashh-softpink/20 transition-all cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
