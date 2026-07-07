'use client';

import { motion } from 'motion/react';

const skills = [
  { name: 'Illustration', level: 95 },
  { name: 'Graphic Design', level: 85 },
  { name: 'Typography', level: 80 },
  { name: 'UI Design', level: 75 },
  { name: 'Brand Identity', level: 88 },
  { name: 'Digital Painting', level: 92 },
  { name: 'Photoshop', level: 98 },
  { name: 'Illustrator', level: 90 },
  { name: 'Figma', level: 85 },
];

export default function Skills() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute -left-40 top-20 w-80 h-80 bg-ashh-softpink/20 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-ashh-accentpink tracking-widest uppercase mb-2">Kemampuan Teknis</h2>
          <h3 className="font-outfit text-4xl font-bold text-gray-900">Keahlian Profesional</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
          {skills.map((skill, i) => (
            <div key={skill.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">{skill.name}</span>
                <span className="text-sm text-gray-500 font-outfit">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-ashh-accentpink to-ashh-lavender h-2.5 rounded-full"
                ></motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
