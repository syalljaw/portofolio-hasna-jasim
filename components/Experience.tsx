'use client';

import { motion } from 'motion/react';

const experiences = [
  {
    year: '2024 - Sekarang',
    role: 'Ilustrator Lepas',
    company: 'Pekerja Mandiri',
    description: 'Membuat ilustrasi kustom untuk berbagai klien internasional, berfokus pada desain karakter dan seni editorial.',
  },
  {
    year: '2022 - 2024',
    role: 'Seniman Komisi',
    company: 'Platform Online',
    description: 'Menghasilkan lebih dari 200+ karya seni kustom berkualitas tinggi untuk klien individu, mempertahankan tingkat kepuasan bintang 5.',
  },
  {
    year: '2020 - 2022',
    role: 'Desainer Grafis',
    company: 'Studio Kreatif X',
    description: 'Membantu dalam pembuatan identitas merek, grafis media sosial, dan materi pemasaran untuk merek butik.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-ashh-lightgray">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-ashh-accentpink tracking-widest uppercase mb-2">Perjalanan Saya</h2>
          <h3 className="font-outfit text-4xl font-bold text-gray-900">Pengalaman</h3>
        </div>

        <div className="relative border-l-2 border-ashh-softpink/50 ml-4 md:ml-0 md:border-none">
          {/* Desktop Center Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-ashh-softpink/50 -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  i % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[25px] md:static md:absolute md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-ashh-accentpink rounded-full border-4 border-white shadow-sm z-10"></div>
                
                <div className={`pl-8 md:pl-0 w-full md:w-1/2 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <span className="inline-block px-3 py-1 bg-ashh-softpink/30 text-ashh-accentpink rounded-full text-xs font-bold tracking-wide mb-3">
                      {exp.year}
                    </span>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{exp.role}</h4>
                    <h5 className="text-sm font-medium text-gray-500 mb-4">{exp.company}</h5>
                    <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
