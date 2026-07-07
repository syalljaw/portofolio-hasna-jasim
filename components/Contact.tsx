/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, Phone } from 'lucide-react';
import Swal from 'sweetalert2';
import { getPortfolioData, savePortfolioData, BioData, MessageItem } from '@/lib/portfolio-store';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bio, setBio] = useState<BioData | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const data = getPortfolioData();
    setBio(data.bio);

    const handleUpdate = () => {
      setBio(getPortfolioData().bio);
    };

    window.addEventListener('portfolio_store_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_store_updated', handleUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call & save to local storage store
    setTimeout(() => {
      const currentData = getPortfolioData();
      
      const newMessage: MessageItem = {
        id: Date.now().toString(),
        name,
        email,
        subject,
        message,
        date: new Date().toISOString().split('T')[0],
        read: false
      };

      const updatedMessages = [newMessage, ...currentData.messages];
      savePortfolioData('ashh_messages', updatedMessages);

      setIsSubmitting(false);
      Swal.fire({
        title: 'Pesan Terkirim!',
        text: 'Terima kasih telah menghubungi saya. Pesan Anda telah berhasil dikirim ke Panel Admin Ashh!',
        icon: 'success',
        confirmButtonColor: '#E9A8C8',
        customClass: {
          popup: 'rounded-2xl',
        }
      });

      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ashh-lavender/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-5/12"
          >
            <h2 className="text-sm font-bold text-ashh-accentpink tracking-widest uppercase mb-2">Hubungi Saya</h2>
            <h3 className="font-outfit text-4xl font-bold text-gray-900 mb-6">Mari Buat Sesuatu yang Ajaib Bersama</h3>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Apakah Anda memiliki proyek dalam pikiran, permintaan komisi, atau hanya ingin menyapa, jangan ragu untuk mengirim pesan. Saat ini saya terbuka untuk peluang baru.
            </p>

            <div className="space-y-6">
              <a href={`mailto:${bio?.email || 'ashvianmadrestya@gmail.com'}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-ashh-lightgray rounded-full flex items-center justify-center text-gray-600 group-hover:bg-ashh-softpink group-hover:text-ashh-accentpink transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Kirim Email</p>
                  <p className="text-gray-900 font-semibold">{bio?.email || 'ashvianmadrestya@gmail.com'}</p>
                </div>
              </a>
              <a href={bio?.whatsappUrl || "https://wa.me/62856470853307"} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-ashh-lightgray rounded-full flex items-center justify-center text-gray-600 group-hover:bg-ashh-softpink group-hover:text-ashh-accentpink transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">WhatsApp</p>
                  <p className="text-gray-900 font-semibold">{bio?.whatsapp || '+62 856-4708-53307'}</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-7/12"
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Anda</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Anda</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
                <input required type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all" placeholder="Tanya Seputar Desain" />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all resize-none" placeholder="Ceritakan tentang proyek Anda..."></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Kirim Pesan <Send size={18} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
