'use client';

// Helper function to generate clean vector SVGs as data URIs
const generateArtSVG = (title: string, bgStart: string, bgEnd: string, element: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
      <defs>
        <linearGradient id="storegrad-${title.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgStart};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${bgEnd};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#storegrad-${title.replace(/\s+/g, '')})" rx="20"/>
      ${element}
      <g opacity="0.15">
        <circle cx="50" cy="50" r="100" fill="%23fff" filter="blur(10px)" />
        <circle cx="350" cy="450" r="120" fill="%23fff" filter="blur(12px)" />
      </g>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

const INITIAL_WORKS = [
  { 
    id: '1', 
    src: generateArtSVG('Ethereal Dreams', '%23F8D9E8', '%23DCC6F0', '%3Ccircle cx="200" cy="220" r="80" fill="%23fff" opacity="0.9" /%3E%3Cpath d="M180,140 A80,80 0 1,0 260,220 A65,65 0 1,1 180,140" fill="%23DCC6F0" /%3E%3Ccircle cx="280" cy="150" r="8" fill="%23E9A8C8" /%3E%3Cpath d="M150,160 L154,168 L162,170 L154,172 L150,180" fill="%23fff" /%3E'), 
    category: 'Illustration', 
    title: 'Ethereal Dreams', 
    likes: 0, 
    views: 0,
    price: 'Rp 450.000',
    description: 'Representasi halus dari keheningan kosmik, menjelajahi palet pastel, gradasi lembut, dan awan fantasi yang indah.',
    status: 'Published',
    featured: true
  },
  { 
    id: '2', 
    src: generateArtSVG('Star Guardian', '%23DCC6F0', '%23E9A8C8', '%3Cpath d="M150,350 L250,150" stroke="%23fff" stroke-width="8" stroke-linecap="round" /%3E%3Ccircle cx="250" cy="150" r="25" fill="%23F8D9E8" /%3E'), 
    category: 'Character Design', 
    title: 'Star Guardian', 
    likes: 0, 
    views: 0,
    price: 'Rp 600.000',
    description: 'Tema prajurit bintang yang elegan menampilkan garis luar tongkat sihir, debu bintang yang melayang, dan bayangan senja yang lembut.',
    status: 'Published',
    featured: true
  },
  { 
    id: '3', 
    src: generateArtSVG('Lost City', '%23F3F4F6', '%23DCC6F0', '%3Crect x="80" y="250" width="60" height="250" fill="%23fff" opacity="0.6" rx="5" /%3E%3Crect x="160" y="180" width="80" height="320" fill="%23fff" opacity="0.8" rx="5" /%3E%3Crect x="260" y="280" width="60" height="220" fill="%23fff" opacity="0.5" rx="5" /%3E'), 
    category: 'Traditional Art', 
    title: 'Lost City', 
    likes: 0, 
    views: 0,
    price: 'Rp 850.000',
    description: 'Siluet kota struktural minimalis yang terendam dalam kabut pagi pastel. Dirancang sebagai seni konsep untuk novel visual yang indah.',
    status: 'Published',
    featured: true
  },
  { 
    id: '4', 
    src: generateArtSVG('Floral Portrait', '%23F8D9E8', '%23F3F4F6', '%3Cpath d="M200,400 Q150,250 200,100 Q250,250 200,400 Z" fill="%23fff" opacity="0.8" /%3E%3Cpath d="M200,400 Q250,300 300,250" fill="none" stroke="%23fff" stroke-width="4" /%3E'), 
    category: 'Portrait Art', 
    title: 'Floral Portrait', 
    likes: 0, 
    views: 0,
    price: 'Rp 500.000',
    description: 'Kombinasi elemen botani organik dan kisi visual yang lembut, menekankan ketenangan alam.',
    status: 'Published',
    featured: true
  },
  { 
    id: '5', 
    src: generateArtSVG('Pastel App UI', '%23F3F4F6', '%23F8D9E8', '%3Crect x="80" y="80" width="240" height="340" rx="24" fill="none" stroke="%23fff" stroke-width="6" /%3E%3Crect x="110" y="120" width="180" height="120" rx="12" fill="%23fff" opacity="0.5" /%3E'), 
    category: 'Graphic Design', 
    title: 'Pastel App UI', 
    likes: 0, 
    views: 0,
    price: 'Rp 1.200.000',
    description: 'Prototipe dasbor antarmuka pengguna yang menampilkan elemen glassmorphism, sudut melingkar yang lembut, dan estetika lembut pastel.',
    status: 'Published',
    featured: false
  },
  { 
    id: '6', 
    src: generateArtSVG('Minimalist Brand', '%23DCC6F0', '%23F3F4F6', '%3Cpath d="M160,250 Q200,150 240,250 Q200,350 160,250 Z" fill="%23fff" opacity="0.7" /%3E%3Ccircle cx="200" cy="250" r="10" fill="%23E9A8C8" /%3E'), 
    category: 'Graphic Design', 
    title: 'Minimalist Brand', 
    likes: 0, 
    views: 0,
    price: 'Rp 350.000',
    description: 'Logo identitas merek yang canggih memadukan kurva bunga dan karya garis modern pada kanvas lavender yang halus.',
    status: 'Published',
    featured: false
  },
  { 
    id: '7', 
    src: generateArtSVG('Sky Castle', '%23F8D9E8', '%23DCC6F0', '%3Cpath d="M100,300 Q150,260 200,300 T300,300" fill="none" stroke="%23fff" stroke-width="5" /%3E%3Cpolygon points="200,120 250,200 200,280 150,200" fill="%23fff" opacity="0.8" /%3E'), 
    category: 'Sketch', 
    title: 'Sky Castle', 
    likes: 0, 
    views: 0,
    price: 'Rp 900.000',
    description: 'Istana terapung di antara awan pastel senja, menggunakan simetri geometris yang bersih dan kedalaman visual kontras tinggi.',
    status: 'Published',
    featured: false
  },
  { 
    id: '8', 
    src: generateArtSVG('Ocean Whisper', '%23DCC6F0', '%23E9A8C8', '%3Cpath d="M50,300 Q125,200 200,300 T350,300" fill="none" stroke="%23fff" stroke-width="6" /%3E%3Ccircle cx="150" cy="180" r="30" fill="%23fff" opacity="0.9" /%3E'), 
    category: 'Illustration', 
    title: 'Ocean Whisper', 
    likes: 0, 
    views: 0,
    price: 'Rp 480.000',
    description: 'Gelombang laut berirama yang halus di bawah bulan kosmik lavender raksasa, memancarkan energi atmosfer yang tenang.',
    status: 'Published',
    featured: false
  },
];

const INITIAL_MESSAGES = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah@example.com', subject: 'Tanya Komisi Ilustrasi', date: '2026-07-06', message: 'Halo Ashh! Saya sangat menyukai karya Ethereal Dreams Anda. Apakah Anda bersedia mendesain sampul buku kustom untuk novel fantasi saya mendatang? Beri tahu saya tarif dan ketersediaan Anda. Terima kasih!', read: false },
  { id: '2', name: 'Michael Chen', email: 'michael@game.dev', subject: 'Aset UI Game', date: '2026-07-05', message: 'Hi Ashh, karya seni UI pastel Anda sangat cocok. Kami sedang mengerjakan game puzzle santai dan membutuhkan 15 layar kustom. Apakah Anda menerima pekerjaan kontrak? Salam hangat.', read: true },
];

const INITIAL_CATEGORIES = ['All', 'Illustration', 'Graphic Design', 'Character Design', 'Poster Design', 'Traditional Art', 'Sketch', 'Portrait Art'];

const INITIAL_BIO = {
  name: 'Ashh',
  username: 'luaveren',
  title: 'Seniman Visual & Ilustrator',
  intro: 'Menghidupkan imajinasi melalui estetika pastel, garis elegan, dan palet warna dreamy. Mari ciptakan sesuatu yang indah bersama.',
  aboutText1: 'Halo, saya Ashh (@luaveren), seorang seniman digital dan ilustrator dengan kecintaan mendalam pada estetika pastel yang lembut dan konsep ethereal. Karya saya menjelajahi persimpangan antara fantasi dan emosi yang halus, memberikan sentuhan lembut unik pada setiap proyek.',
  aboutText2: 'Dengan pengalaman bertahun-tahun dalam lukisan digital, branding, dan ilustrasi konseptual, saya berusaha menciptakan seni yang tidak hanya indah dipandang tetapi juga beresonansi di dalam hati.',
  softwares: ['Adobe Photoshop', 'Illustrator', 'Clip Studio Paint', 'Canva', 'Ibis Paint', 'Figma'],
  email: 'ashvianmadrestya@gmail.com',
  whatsapp: '+62 856-4708-53307',
  whatsappUrl: 'https://wa.me/62856470853307',
  avatarUrl: '',
  heroUrl: ''
};

const INITIAL_SETTINGS = {
  seoTitle: 'Portofolio Ashh - Seniman Digital & Ilustrator Estetika Pastel',
  seoDescription: 'Karya seni digital ethereal, aset desain kustom, dan ilustrasi oleh Ashh (@luaveren). Lihat portofolio dan lakukan pemesanan komisi.',
  pricingPolicy: 'Komisi dimulai dari Rp 350.000 tergantung pada tingkat kompleksitas karya. Semua pesanan mencakup file resolusi tinggi, file sumber berlapis (PSD/AI), dan hak non-komersial. Lisensi komersial kustom juga tersedia.',
  maintenanceMode: false
};

export interface WorkItem {
  id: string;
  src: string;
  category: string;
  title: string;
  likes: number;
  views: number;
  price: string;
  description: string;
  status: 'Published' | 'Draft' | 'Hidden';
  featured: boolean;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  message: string;
  read: boolean;
}

export interface BioData {
  name: string;
  username: string;
  title: string;
  intro: string;
  aboutText1: string;
  aboutText2: string;
  softwares: string[];
  email: string;
  whatsapp: string;
  whatsappUrl: string;
  avatarUrl?: string;
  heroUrl?: string;
}

export interface SettingData {
  seoTitle: string;
  seoDescription: string;
  pricingPolicy: string;
  maintenanceMode: boolean;
}

// Client safe utility to read from and write to localStorage
export const getPortfolioData = () => {
  if (typeof window === 'undefined') {
    return {
      works: INITIAL_WORKS,
      messages: INITIAL_MESSAGES,
      categories: INITIAL_CATEGORIES,
      bio: INITIAL_BIO,
      settings: INITIAL_SETTINGS
    };
  }

  const works = localStorage.getItem('ashh_works');
  const messages = localStorage.getItem('ashh_messages');
  const categories = localStorage.getItem('ashh_categories');
  const bio = localStorage.getItem('ashh_bio');
  const settings = localStorage.getItem('ashh_settings');

  let parsedCategories = INITIAL_CATEGORIES;
  if (categories) {
    try {
      const stored = JSON.parse(categories) as string[];
      // Merge with initial ones to ensure newly added categories are loaded, and eliminate duplicates
      const merged = Array.from(new Set([...stored, ...INITIAL_CATEGORIES]));
      const filtered = merged.filter(c => c !== 'All');
      parsedCategories = ['All', ...filtered];
    } catch (e) {
      parsedCategories = INITIAL_CATEGORIES;
    }
  }

  return {
    works: works ? JSON.parse(works) : INITIAL_WORKS,
    messages: messages ? JSON.parse(messages) : INITIAL_MESSAGES,
    categories: parsedCategories,
    bio: bio ? JSON.parse(bio) : INITIAL_BIO,
    settings: settings ? JSON.parse(settings) : INITIAL_SETTINGS
  };
};

export const savePortfolioData = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event to trigger reactive updates in other components
    window.dispatchEvent(new Event('portfolio_store_updated'));
  }
};

export const triggerCustomUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('portfolio_store_updated'));
  }
};

// SVG background preset options to easily assign to newly created items
export const SVG_PRESETS = [
  { name: 'Pink Rose Gradient', start: '%23F8D9E8', end: '%23DCC6F0', element: '%3Ccircle cx="200" cy="220" r="80" fill="%23fff" opacity="0.9" /%3E' },
  { name: 'Lavender Bliss', start: '%23DCC6F0', end: '%23E9A8C8', element: '%3Ccircle cx="200" cy="250" r="70" fill="none" stroke="%23fff" stroke-width="10" /%3E' },
  { name: 'Sunset Pastel', start: '%23E9A8C8', end: '%23F8D9E8', element: '%3Cpath d="M150,300 C200,200 200,200 250,300" fill="none" stroke="%23fff" stroke-width="8" /%3E' },
  { name: 'Frost Mint', start: '%23F3F4F6', end: '%23DCC6F0', element: '%3Crect x="120" y="150" width="160" height="200" fill="%23fff" opacity="0.6" rx="10" /%3E' }
];

export const generatePresetSVG = (presetName: string, title: string) => {
  const preset = SVG_PRESETS.find(p => p.name === presetName) || SVG_PRESETS[0];
  return generateArtSVG(title, preset.start, preset.end, preset.element);
};

export const trackView = (workId: string) => {
  if (typeof window === 'undefined') return;
  const viewedKey = 'ashh_viewed_works';
  const viewedStr = localStorage.getItem(viewedKey) || '[]';
  const viewedList: string[] = JSON.parse(viewedStr);
  
  if (!viewedList.includes(workId)) {
    const data = getPortfolioData();
    const updatedWorks = data.works.map((w: WorkItem) => {
      if (w.id === workId) {
        return { ...w, views: (w.views || 0) + 1 };
      }
      return w;
    });
    savePortfolioData('ashh_works', updatedWorks);
    
    viewedList.push(workId);
    localStorage.setItem(viewedKey, JSON.stringify(viewedList));
  }
};

export const trackLikeToggle = (workId: string): boolean => {
  if (typeof window === 'undefined') return false;
  const likedKey = 'ashh_liked_works';
  const likedStr = localStorage.getItem(likedKey) || '[]';
  const likedList: string[] = JSON.parse(likedStr);
  
  const data = getPortfolioData();
  const isCurrentlyLiked = likedList.includes(workId);
  
  let newLikedList: string[];
  let change = 0;
  
  if (isCurrentlyLiked) {
    newLikedList = likedList.filter(id => id !== workId);
    change = -1;
  } else {
    newLikedList = [...likedList, workId];
    change = 1;
  }
  
  const updatedWorks = data.works.map((w: WorkItem) => {
    if (w.id === workId) {
      const currentLikes = w.likes || 0;
      return { ...w, likes: Math.max(0, currentLikes + change) };
    }
    return w;
  });
  
  savePortfolioData('ashh_works', updatedWorks);
  localStorage.setItem(likedKey, JSON.stringify(newLikedList));
  
  return !isCurrentlyLiked;
};

export const isWorkLiked = (workId: string): boolean => {
  if (typeof window === 'undefined') return false;
  const likedKey = 'ashh_liked_works';
  const likedStr = localStorage.getItem(likedKey) || '[]';
  const likedList: string[] = JSON.parse(likedStr);
  return likedList.includes(workId);
};

