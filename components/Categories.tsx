'use client';

import { motion } from 'motion/react';
import { 
  Palette, Type, FileImage, UserCircle, 
  Hexagon, Megaphone, Monitor, Lightbulb, 
  Heart, Brush, PenTool, Image as ImageIcon 
} from 'lucide-react';

const categories = [
  { name: 'Illustration', icon: Palette, color: 'bg-pink-50 text-pink-500' },
  { name: 'Typography', icon: Type, color: 'bg-purple-50 text-purple-500' },
  { name: 'Poster Design', icon: FileImage, color: 'bg-blue-50 text-blue-500' },
  { name: 'Character Design', icon: UserCircle, color: 'bg-rose-50 text-rose-500' },
  { name: 'Logo Design', icon: Hexagon, color: 'bg-indigo-50 text-indigo-500' },
  { name: 'Branding', icon: Megaphone, color: 'bg-orange-50 text-orange-500' },
  { name: 'UI Design', icon: Monitor, color: 'bg-teal-50 text-teal-500' },
  { name: 'Concept Art', icon: Lightbulb, color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Fanart', icon: Heart, color: 'bg-red-50 text-red-500' },
  { name: 'Commission', icon: PenTool, color: 'bg-green-50 text-green-500' },
  { name: 'Digital Art', icon: Monitor, color: 'bg-sky-50 text-sky-500' },
  { name: 'Traditional Art', icon: Brush, color: 'bg-amber-50 text-amber-600' },
];

export default function Categories() {
  return (
    <section id="categories" className="py-24 bg-ashh-lightgray">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-ashh-accentpink tracking-widest uppercase mb-2">Keahlian Saya</h2>
          <h3 className="font-outfit text-4xl font-bold text-gray-900 mb-4">Kategori Kreatif</h3>
          <p className="text-gray-600">Menjelajahi berbagai bentuk komunikasi visual untuk menghidupkan ide di berbagai media.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center group border border-transparent hover:border-ashh-softpink cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <Icon size={24} />
                </div>
                <h4 className="font-semibold text-gray-800">{cat.name}</h4>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
