/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { ArrowUpRight, X, Heart, Eye } from 'lucide-react';
import { getPortfolioData, WorkItem, trackView, trackLikeToggle, isWorkLiked } from '@/lib/portfolio-store';

export default function FeaturedWorks() {
  const [featured, setFeatured] = useState<WorkItem[]>([]);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);

  useEffect(() => {
    const data = getPortfolioData();
    // Filter published and featured works
    const filtered = data.works.filter((w: WorkItem) => w.status === 'Published' && w.featured);
    setFeatured(filtered.slice(0, 8)); // Show top 8 featured works now that they are smaller!

    const handleUpdate = () => {
      const updatedData = getPortfolioData();
      const updatedFiltered = updatedData.works.filter((w: WorkItem) => w.status === 'Published' && w.featured);
      setFeatured(updatedFiltered.slice(0, 8));
    };

    window.addEventListener('portfolio_store_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_store_updated', handleUpdate);
  }, []);

  const handleOpenWork = (work: WorkItem) => {
    setSelectedWork(work);
    trackView(work.id);
  };

  const activeWork = selectedWork ? (featured.find(w => w.id === selectedWork.id) || selectedWork) : null;
  const isLiked = activeWork ? isWorkLiked(activeWork.id) : false;

  return (
    <section id="featured" className="py-24 bg-ashh-lightgray/40 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <h2 className="text-sm font-bold text-ashh-accentpink tracking-widest uppercase mb-2">Kreasi Pilihan</h2>
            <h3 className="font-outfit text-4xl font-bold text-gray-900">Karya Unggulan</h3>
          </div>
          <p className="text-gray-500 max-w-md mt-4 md:mt-0 leading-relaxed font-light">
            Kumpulan karya pilihan dari tema ilustrasi favorit saya, lukisan digital, dan tata letak konsep premium. Klik karya untuk melihat detail penjelasan.
          </p>
        </div>

        {/* Smaller cards with larger column count: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((work, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              key={work.id}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.01)] border border-gray-100 group hover:shadow-[0_12px_30px_rgba(233,168,200,0.15)] transition-all duration-300 cursor-pointer"
              onClick={() => handleOpenWork(work)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ashh-lightgray">
                <Image
                  src={work.src}
                  alt={work.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 p-2 rounded-[1.5rem]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold text-ashh-accentpink uppercase tracking-widest block mb-1">{work.category}</span>
                <h4 className="font-outfit text-base font-bold text-gray-900 line-clamp-1 group-hover:text-ashh-accentpink transition-colors duration-200">{work.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {featured.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            Belum ada karya unggulan saat ini. Anda dapat menandai karya sebagai unggulan di panel admin.
          </div>
        )}

      </div>

      {/* Detail Explanation Modal */}
      <AnimatePresence>
        {selectedWork && activeWork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWork(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 z-10 max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedWork(null)}
                className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md hover:bg-white p-2 rounded-full text-gray-500 hover:text-gray-900 shadow-sm transition-all duration-200"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  
                  {/* Left Side: Photo Frame */}
                  <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px] bg-ashh-lightgray p-4 flex items-center justify-center">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md">
                      <Image
                        src={activeWork.src}
                        alt={activeWork.title}
                        fill
                        unoptimized
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Right Side: Explanation */}
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 bg-ashh-accentpink/10 text-ashh-accentpink text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                        {activeWork.category}
                      </span>
                      <h3 className="font-outfit text-3xl font-bold text-gray-900 mb-4">{activeWork.title}</h3>
                      
                      <div className="space-y-4 text-gray-600 mb-6">
                        <div>
                          <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Tentang Karya</h4>
                          <p className="text-sm leading-relaxed font-light">
                            {activeWork.description || "Tidak ada deskripsi tambahan untuk karya ini."}
                          </p>
                        </div>

                        {activeWork.price && (
                          <div>
                            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-1">Perkiraan Biaya / Harga</h4>
                            <p className="text-base font-medium text-gray-900 font-mono">{activeWork.price}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats and Interaction */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => trackLikeToggle(activeWork.id)}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer ${
                            isLiked 
                              ? 'bg-ashh-softpink/20 border-ashh-accentpink/30 text-ashh-accentpink font-semibold' 
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-ashh-accentpink hover:border-ashh-accentpink/20'
                          }`}
                        >
                          <Heart size={14} className={isLiked ? "fill-ashh-accentpink text-ashh-accentpink" : "text-gray-400"} />
                          <span className="text-xs font-mono">{activeWork.likes || 0} suka</span>
                        </button>
                        <div className="flex items-center space-x-1.5 text-gray-400">
                          <Eye size={14} className="text-gray-400" />
                          <span className="text-xs font-mono text-gray-600">{activeWork.views || 0} dilihat</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedWork(null);
                          // Scroll to contact form
                          const contactSection = document.getElementById('contact');
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="px-4 py-2 bg-ashh-accentpink hover:bg-ashh-accentpink/90 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all duration-200"
                      >
                        Pesan Karya
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
