/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { X, Heart, Eye, ShoppingBag } from 'lucide-react';
import { getPortfolioData, WorkItem, trackView, trackLikeToggle, isWorkLiked } from '@/lib/portfolio-store';

export default function Gallery() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImg, setSelectedImg] = useState<WorkItem | null>(null);

  useEffect(() => {
    const data = getPortfolioData();
    setWorks(data.works);
    setCategories(data.categories);

    const handleUpdate = () => {
      const updatedData = getPortfolioData();
      setWorks(updatedData.works);
      setCategories(updatedData.categories);
    };

    window.addEventListener('portfolio_store_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_store_updated', handleUpdate);
  }, []);

  // Filter only published items
  const publishedWorks = works.filter(w => w.status === 'Published');

  const filteredImages = publishedWorks.filter((img) => {
    const matchesCategory = selectedCategory === 'All' || img.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          img.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenImg = (img: WorkItem) => {
    setSelectedImg(img);
    trackView(img.id);
  };

  const activeImg = selectedImg ? (works.find(w => w.id === selectedImg.id) || selectedImg) : null;
  const isLiked = activeImg ? isWorkLiked(activeImg.id) : false;

  return (
    <section id="gallery" className="py-24 bg-gradient-to-tr from-ashh-lavender/10 via-white to-ashh-softpink/10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-sm font-bold text-ashh-accentpink tracking-widest uppercase mb-2">Kreasi Saya</h2>
            <h3 className="font-outfit text-4xl font-bold text-gray-900">Jelajahi Galeri</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <input 
              type="text" 
              placeholder="Cari karya seni..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-sm focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm w-full sm:w-64"
            />
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {category === 'All' ? 'Semua' : category}
            </button>
          ))}
        </div>

        {/* Vertically scrollable container for smaller cards */}
        <div className="max-h-[700px] overflow-y-auto pr-2 custom-scrollbar border border-gray-100 rounded-3xl p-6 bg-ashh-lightgray/30">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={img.id}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  onClick={() => handleOpenImg(img)}
                >
                  <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-ashh-lightgray to-white">
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover p-2 rounded-2xl transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Subtle info footer instead of big overlay for smaller cards */}
                  <div className="p-3 bg-white">
                    <span className="text-[10px] font-bold text-ashh-accentpink uppercase tracking-wider block mb-0.5">{img.category}</span>
                    <h4 className="text-gray-900 font-outfit text-sm font-bold truncate">{img.title}</h4>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 text-[11px] text-gray-500">
                      <span className="font-semibold text-gray-800">{img.price}</span>
                      <span className="flex items-center gap-1"><Heart size={10} className="text-ashh-accentpink fill-ashh-accentpink" /> {img.likes}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              Tidak ada karya seni yang cocok dengan kriteria pencarian Anda.
            </div>
          )}
        </div>

      </div>

      {/* Lightbox Modal with Details & Pricing */}
      <AnimatePresence>
        {selectedImg && activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-6 right-6 text-white hover:text-ashh-softpink transition-colors z-[110]">
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-[105]"
              onClick={e => e.stopPropagation()}
            >
              {/* Image side */}
              <div className="flex-1 bg-ashh-lightgray p-8 flex items-center justify-center relative min-h-[300px] md:min-h-[450px]">
                <div className="relative w-full h-full min-h-[250px] md:min-h-[400px]">
                  <Image
                    src={activeImg.src}
                    alt={activeImg.title}
                    fill
                    unoptimized
                    className="object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Details side */}
              <div className="w-full md:w-[380px] p-8 flex flex-col justify-between bg-white border-l border-gray-100">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-ashh-softpink/30 text-ashh-accentpink rounded-full text-xs font-bold tracking-wide">
                      {activeImg.category}
                    </span>
                    <div className="flex items-center gap-4 text-xs">
                      <button
                        type="button"
                        onClick={() => trackLikeToggle(activeImg.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                          isLiked 
                            ? 'bg-ashh-softpink/20 border-ashh-accentpink/30 text-ashh-accentpink font-semibold' 
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-ashh-accentpink hover:border-ashh-accentpink/20'
                        }`}
                      >
                        <Heart size={12} className={isLiked ? "fill-ashh-accentpink text-ashh-accentpink" : "text-gray-400"} />
                        <span>{activeImg.likes || 0}</span>
                      </button>
                      <span className="flex items-center gap-1 text-gray-400"><Eye size={14} /> {activeImg.views || 0}</span>
                    </div>
                  </div>

                  <h3 className="font-outfit text-3xl font-bold text-gray-900 mb-2">{activeImg.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {activeImg.description}
                  </p>

                  <div className="bg-ashh-lightgray/50 p-4 rounded-2xl mb-6">
                    <span className="text-xs text-gray-500 font-medium block mb-1">Harga Komisi</span>
                    <span className="text-2xl font-outfit font-extrabold text-gray-900">{activeImg.price}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <a 
                    href="#contact"
                    onClick={() => setSelectedImg(null)}
                    className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-center text-sm shadow-md"
                  >
                    <ShoppingBag size={16} /> Pesan / Komisi Karya Ini
                  </a>
                  <p className="text-center text-[11px] text-gray-400">
                    Termasuk hak penggunaan komersial & kustomisasi khusus.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
