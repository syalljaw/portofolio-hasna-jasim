'use client';

import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const getInitialsSvg = (name: string, bg: string) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
      <rect width="100%" height="100%" fill="${bg}" rx="50"/>
      <text x="50%" y="55%" font-family="Outfit, sans-serif" font-weight="bold" font-size="34" fill="%23FFFFFF" dominant-baseline="middle" text-anchor="middle">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${svg.trim()}`;
};

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Art Director',
    content: 'Ashh has an incredible eye for pastel palettes. The character designs we commissioned were delivered on time and exceeded our expectations. Highly recommended!',
    rating: 5,
    avatar: getInitialsSvg('Sarah Jenkins', '%23F8D9E8')
  },
  {
    name: 'Michael Chen',
    role: 'Game Developer',
    content: 'Working with @luaveren was a breeze. The UI assets provided for our indie game were perfectly aligned with the ethereal vibe we were going for.',
    rating: 5,
    avatar: getInitialsSvg('Michael Chen', '%23DCC6F0')
  },
  {
    name: 'Emily Davis',
    role: 'Author',
    content: 'The book cover illustration Ashh created for my fantasy novel is stunning. Everyone asks who the artist is. Truly talented!',
    rating: 5,
    avatar: getInitialsSvg('Emily Davis', '%23E9A8C8')
  },
  {
    name: 'David Wilson',
    role: 'Brand Manager',
    content: 'Very professional, easy to communicate with, and the final branding materials were exactly what we needed. Will definitely hire again.',
    rating: 4,
    avatar: getInitialsSvg('David Wilson', '%23C5D3E8')
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-ashh-accentpink tracking-widest uppercase mb-2">Client Reviews</h2>
          <h3 className="font-outfit text-4xl font-bold text-gray-900">What People Say</h3>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 }
            }}
            pagination={{ clickable: true, bulletClass: 'swiper-pagination-bullet bg-ashh-accentpink' }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="pb-16"
          >
            {testimonials.map((test, i) => (
              <SwiperSlide key={i}>
                <div className="bg-ashh-lightgray p-8 rounded-3xl relative h-full flex flex-col border border-gray-100">
                  <Quote className="absolute top-6 right-8 text-ashh-softpink opacity-50" size={48} />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} size={16} className={index < test.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-8 flex-grow leading-relaxed italic">&ldquo;{test.content}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <Image src={test.avatar} alt={test.name} width={48} height={48} className="rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h5 className="font-bold text-gray-900">{test.name}</h5>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{test.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
