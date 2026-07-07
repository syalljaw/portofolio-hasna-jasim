/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, Image as ImageIcon, Tags, User, 
  MessageSquare, Settings, LogOut, Plus, Edit2, 
  Trash2, Eye, Star, Archive, ShieldAlert, Sparkles,
  Mail, Phone, Save, CheckCircle, ArrowLeft, ArrowUpRight,
  Lock, Key, Menu, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import { 
  getPortfolioData, 
  savePortfolioData, 
  WorkItem, 
  MessageItem, 
  BioData, 
  SettingData, 
  SVG_PRESETS, 
  generatePresetSVG,
  triggerCustomUpdate
} from '@/lib/portfolio-store';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Loaded portfolio state
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [bio, setBio] = useState<BioData | null>(null);
  const [settings, setSettings] = useState<SettingData | null>(null);

  // Modal & Form States
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [workTitle, setWorkTitle] = useState('');
  const [workCategory, setWorkCategory] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [workPrice, setWorkPrice] = useState('');
  const [workStatus, setWorkStatus] = useState<'Published' | 'Draft' | 'Hidden'>('Published');
  const [workFeatured, setWorkFeatured] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(SVG_PRESETS[0].name);
  const [workSrc, setWorkSrc] = useState('');
  const [workSrcType, setWorkSrcType] = useState<'preset' | 'custom'>('preset');

  // Category State
  const [newCategoryName, setNewCategoryName] = useState('');

  // Selected message detail view state
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  // Load state on mount
  useEffect(() => {
    // Check local authentication state
    const adminAuth = localStorage.getItem('ashh_admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }

    const data = getPortfolioData();
    setWorks(data.works);
    setMessages(data.messages);
    setCategories(data.categories);
    setBio(data.bio);
    setSettings(data.settings);
  }, [isAuthenticated]);

  // Handle Log-in
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'luaveren' && password === 'EMRIS0987!') {
      setIsAuthenticated(true);
      localStorage.setItem('ashh_admin_authenticated', 'true');
      Swal.fire({
        title: 'Logged In Successfully',
        text: 'Welcome back to your creative panel, Ashh!',
        icon: 'success',
        confirmButtonColor: '#E9A8C8'
      });
    } else {
      Swal.fire('Error', 'Invalid credentials', 'error');
    }
  };

  // Handle Log-out
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ashh_admin_authenticated');
  };

  // Trigger save operation
  const updateData = (key: string, data: any) => {
    savePortfolioData(key, data);
    // Reload state locally
    const fresh = getPortfolioData();
    setWorks(fresh.works);
    setMessages(fresh.messages);
    setCategories(fresh.categories);
    setBio(fresh.bio);
    setSettings(fresh.settings);
  };

  // Works operations
  const openAddWorkModal = () => {
    setEditingWork(null);
    setWorkTitle('');
    setWorkCategory(categories[1] || 'Illustration');
    setWorkDescription('');
    setWorkPrice('Rp 450.000');
    setWorkStatus('Published');
    setWorkFeatured(false);
    setSelectedPreset(SVG_PRESETS[0].name);
    setWorkSrc('');
    setWorkSrcType('preset');
    setIsWorkModalOpen(true);
  };

  const openEditWorkModal = (work: WorkItem) => {
    setEditingWork(work);
    setWorkTitle(work.title);
    setWorkCategory(work.category);
    setWorkDescription(work.description);
    setWorkPrice(work.price);
    setWorkStatus(work.status);
    setWorkFeatured(work.featured);
    setWorkSrc(work.src);
    setWorkSrcType(work.src.startsWith('data:image/svg+xml') ? 'preset' : 'custom');
    setIsWorkModalOpen(true);
  };

  const saveWork = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSrc = workSrcType === 'custom' ? workSrc : generatePresetSVG(selectedPreset, workTitle);
    
    if (editingWork) {
      // Edit mode
      const updated = works.map(w => w.id === editingWork.id ? {
        ...w,
        title: workTitle,
        category: workCategory,
        description: workDescription,
        price: workPrice,
        status: workStatus,
        featured: workFeatured,
        src: finalSrc
      } : w);
      updateData('ashh_works', updated);
      Swal.fire('Updated!', 'Artwork updated successfully.', 'success');
    } else {
      // Add mode
      const newWork: WorkItem = {
        id: Date.now().toString(),
        title: workTitle,
        category: workCategory,
        description: workDescription,
        price: workPrice,
        status: workStatus,
        featured: workFeatured,
        likes: 0,
        views: 0,
        src: finalSrc
      };
      updateData('ashh_works', [newWork, ...works]);
      Swal.fire('Added!', 'New artwork created successfully with real-time analytics.', 'success');
    }
    setIsWorkModalOpen(false);
  };

  const deleteWork = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5c5c',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const remaining = works.filter(w => w.id !== id);
        updateData('ashh_works', remaining);
        Swal.fire('Deleted!', 'Artwork has been deleted.', 'success');
      }
    });
  };

  const toggleFeaturedWork = (work: WorkItem) => {
    const updated = works.map(w => w.id === work.id ? { ...w, featured: !w.featured } : w);
    updateData('ashh_works', updated);
    Swal.fire('Success', work.featured ? 'Removed from featured.' : 'Marked as featured work!', 'success');
  };

  // Categories Operations
  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.some(c => c.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      Swal.fire('Error', 'Category already exists', 'error');
      return;
    }
    const updated = [...categories, newCategoryName.trim()];
    updateData('ashh_categories', updated);
    setNewCategoryName('');
    Swal.fire('Added!', 'New category added successfully.', 'success');
  };

  const removeCategory = (name: string) => {
    if (name === 'All') {
      Swal.fire('Error', 'Cannot remove "All" category', 'error');
      return;
    }
    Swal.fire({
      title: `Delete category "${name}"?`,
      text: 'Artworks using this category will still remain but their category name won\'t change.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5c5c',
      confirmButtonText: 'Yes, remove'
    }).then(result => {
      if (result.isConfirmed) {
        const filtered = categories.filter(c => c !== name);
        updateData('ashh_categories', filtered);
        Swal.fire('Removed!', 'Category removed successfully.', 'success');
      }
    });
  };

  // About profile update
  const saveBioChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bio) return;
    updateData('ashh_bio', bio);
    Swal.fire('Saved!', 'About profile details saved successfully.', 'success');
  };

  const handleBioTextChange = (field: keyof BioData, value: string) => {
    if (!bio) return;
    setBio({ ...bio, [field]: value });
  };

  const handleSoftwareChange = (index: number, val: string) => {
    if (!bio) return;
    const updatedSoftwares = [...bio.softwares];
    updatedSoftwares[index] = val;
    setBio({ ...bio, softwares: updatedSoftwares });
  };

  const addSoftwareTag = () => {
    if (!bio) return;
    setBio({ ...bio, softwares: [...bio.softwares, 'New Software'] });
  };

  const removeSoftwareTag = (index: number) => {
    if (!bio) return;
    const filtered = bio.softwares.filter((_, i) => i !== index);
    setBio({ ...bio, softwares: filtered });
  };

  // Settings & SEO operations
  const saveSettingsChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    updateData('ashh_settings', settings);
    Swal.fire('Saved!', 'Settings and policies updated successfully.', 'success');
  };

  // Messages Operations
  const viewMessageDetail = (msg: MessageItem) => {
    setSelectedMessage(msg);
    // Mark as read immediately
    const updated = messages.map(m => m.id === msg.id ? { ...m, read: true } : m);
    updateData('ashh_messages', updated);
  };

  const deleteMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Delete this message?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5c5c',
      confirmButtonText: 'Delete'
    }).then(result => {
      if (result.isConfirmed) {
        const remaining = messages.filter(m => m.id !== id);
        updateData('ashh_messages', remaining);
        setSelectedMessage(null);
        Swal.fire('Deleted!', 'Message deleted from inbox.', 'success');
      }
    });
  };

  // Export backup file
  const exportPortfolioData = () => {
    const rawData = {
      works: localStorage.getItem('ashh_works'),
      categories: localStorage.getItem('ashh_categories'),
      bio: localStorage.getItem('ashh_bio'),
      settings: localStorage.getItem('ashh_settings'),
      messages: localStorage.getItem('ashh_messages')
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rawData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    Swal.fire('Exported!', 'Data portofolio berhasil di-export ke file JSON!', 'success');
  };

  // Import backup file
  const importPortfolioData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.works) localStorage.setItem('ashh_works', parsed.works);
          if (parsed.categories) localStorage.setItem('ashh_categories', parsed.categories);
          if (parsed.bio) localStorage.setItem('ashh_bio', parsed.bio);
          if (parsed.settings) localStorage.setItem('ashh_settings', parsed.settings);
          if (parsed.messages) localStorage.setItem('ashh_messages', parsed.messages);
          
          // Re-load
          const fresh = getPortfolioData();
          setWorks(fresh.works);
          setCategories(fresh.categories);
          setBio(fresh.bio);
          setSettings(fresh.settings);
          setMessages(fresh.messages);
          triggerCustomUpdate();
          Swal.fire('Imported!', 'Data portofolio berhasil dipulihkan dari file backup!', 'success');
        } catch (err) {
          Swal.fire('Error', 'File backup tidak valid.', 'error');
        }
      };
    }
  };

  // Reset analytics back to clean real-time values (0)
  const resetAnalytics = () => {
    Swal.fire({
      title: 'Reset Semua Views & Likes?',
      text: 'Semua jumlah suka dan jumlah tayangan pada setiap karya akan disetel kembali ke 0. Tindakan ini tidak dapat dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5c5c',
      confirmButtonText: 'Ya, Setel Ulang ke 0',
      cancelButtonText: 'Batal'
    }).then(result => {
      if (result.isConfirmed) {
        const updated = works.map(w => ({ ...w, views: 0, likes: 0 }));
        updateData('ashh_works', updated);
        // Clean localStorage tracking keys
        localStorage.removeItem('ashh_viewed_works');
        localStorage.removeItem('ashh_liked_works');
        Swal.fire('Selesai!', 'Jumlah tayangan dan suka berhasil disetel ulang ke 0.', 'success');
      }
    });
  };

  // Revert all data back to factory default
  const revertToDefault = () => {
    Swal.fire({
      title: 'Kembalikan ke Default Template?',
      text: 'Semua karya khusus, kategori kustom, dan biografi Anda akan dihapus dan diganti dengan data bawaan pabrik.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff5c5c',
      confirmButtonText: 'Ya, Kembalikan',
      cancelButtonText: 'Batal'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.removeItem('ashh_works');
        localStorage.removeItem('ashh_categories');
        localStorage.removeItem('ashh_bio');
        localStorage.removeItem('ashh_settings');
        localStorage.removeItem('ashh_messages');
        localStorage.removeItem('ashh_viewed_works');
        localStorage.removeItem('ashh_liked_works');
        
        // Reload state
        const fresh = getPortfolioData();
        setWorks(fresh.works);
        setCategories(fresh.categories);
        setBio(fresh.bio);
        setSettings(fresh.settings);
        setMessages(fresh.messages);
        triggerCustomUpdate();
        Swal.fire('Berhasil!', 'Database portofolio telah dikembalikan ke kondisi awal.', 'success');
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': {
        // Compute live calculations
        const totalViews = works.reduce((sum, w) => sum + w.views, 0);
        const totalLikes = works.reduce((sum, w) => sum + w.likes, 0);
        const totalPublished = works.filter(w => w.status === 'Published').length;
        const totalDrafts = works.filter(w => w.status === 'Draft').length;

        // Group works count by category for custom bar graph
        const categoryCounts: Record<string, number> = {};
        works.forEach(w => {
          categoryCounts[w.category] = (categoryCounts[w.category] || 0) + 1;
        });

        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-outfit tracking-tight">Overview Dashboard</h2>
                <p className="text-gray-500 text-sm mt-1">Live analytics computed from your active artwork catalog</p>
              </div>
              <a 
                href="/" 
                target="_blank" 
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 shadow-sm rounded-xl text-xs font-semibold tracking-wide transition-all"
              >
                View Live Website <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Cumulative Portfolio Views', val: totalViews.toLocaleString(), icon: Eye, color: 'text-indigo-500 bg-indigo-50 border-indigo-100/50' },
                { label: 'Total Love & Likes', val: totalLikes.toLocaleString(), icon: Star, color: 'text-rose-500 bg-rose-50 border-rose-100/50' },
                { label: 'Published Creations', val: totalPublished, icon: ImageIcon, color: 'text-emerald-500 bg-emerald-50 border-emerald-100/50' },
                { label: 'Incoming Inbox Messages', val: messages.length, icon: MessageSquare, color: 'text-amber-500 bg-amber-50 border-amber-100/50' }
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className={`bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border ${stat.color} flex items-center gap-5 hover:translate-y-[-2px] transition-transform`}>
                    <div className="p-4 rounded-2xl bg-white shadow-inner flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1 font-outfit">{stat.val}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bespoke Custom SVG Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Traffic Chart */}
              <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between min-h-[350px]">
                <div>
                  <h3 className="font-outfit text-lg font-bold text-gray-900">Traffic Simulation (Views)</h3>
                  <p className="text-gray-400 text-xs mt-1">Simulated periodic monthly visitor volume</p>
                </div>
                {/* SVG Graph */}
                <div className="w-full h-48 mt-6 relative flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E9A8C8" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#E9A8C8" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 10 110 Q 90 90 170 120 T 330 60 T 490 30 L 490 150 L 10 150 Z" 
                      fill="url(#chart-grad)"
                    />
                    <path 
                      d="M 10 110 Q 90 90 170 120 T 330 60 T 490 30" 
                      fill="none" 
                      stroke="#E9A8C8" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />
                    <circle cx="170" cy="120" r="5" fill="#fff" stroke="#E9A8C8" strokeWidth="2" />
                    <circle cx="330" cy="60" r="5" fill="#fff" stroke="#E9A8C8" strokeWidth="2" />
                    <circle cx="490" cy="30" r="5" fill="#E9A8C8" />
                  </svg>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-gray-400 px-2 pt-2 border-t border-gray-50 font-semibold font-mono">
                    <span>JAN</span>
                    <span>MAR</span>
                    <span>MAY</span>
                    <span>JULY (Peak)</span>
                  </div>
                </div>
              </div>

              {/* Works Categories custom list charts */}
              <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-outfit text-lg font-bold text-gray-900">Creations by Category</h3>
                  <p className="text-gray-400 text-xs mt-1">Real-time allocation of your published artworks</p>
                </div>
                <div className="space-y-4 mt-6 flex-grow flex flex-col justify-center">
                  {Object.keys(categoryCounts).length === 0 ? (
                    <p className="text-gray-400 text-sm italic">No artworks in gallery yet.</p>
                  ) : (
                    Object.entries(categoryCounts).map(([cat, count]) => {
                      const max = Math.max(...Object.values(categoryCounts));
                      const percent = (count / max) * 100;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-gray-700">
                            <span>{cat}</span>
                            <span>{count} work{count > 1 ? 's' : ''}</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-ashh-softpink to-ashh-accentpink rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* System Utilities & Backup Tools (Useful Admin Features) */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-ashh-accentpink animate-pulse" />
                <h3 className="font-outfit text-xl font-bold text-gray-900">Sistem &amp; Backup Utilitas</h3>
              </div>
              <p className="text-gray-500 text-sm mb-6">Kelola data portofolio Anda, ekspor/impor cadangan, atau atur ulang statistik analitik tayangan dan suka secara real-time.</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Export Card */}
                <div className="p-5 bg-ashh-lightgray/30 border border-gray-100 rounded-2xl flex flex-col justify-between hover:border-ashh-softpink/50 transition-all">
                  <div>
                    <h4 className="font-outfit text-sm font-bold text-gray-800 mb-1">Ekspor Portofolio (JSON)</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Unduh semua karya, biografi, dan pesan ke file cadangan lokal.</p>
                  </div>
                  <button 
                    onClick={exportPortfolioData}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center"
                  >
                    Ekspor Data
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-5 bg-ashh-lightgray/30 border border-gray-100 rounded-2xl flex flex-col justify-between hover:border-ashh-softpink/50 transition-all">
                  <div>
                    <h4 className="font-outfit text-sm font-bold text-gray-800 mb-1">Impor Portofolio (JSON)</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Unggah file cadangan JSON untuk memulihkan seluruh data Anda.</p>
                  </div>
                  <label className="w-full py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center block">
                    <span>Impor Data</span>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={importPortfolioData}
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Reset Analytics Card */}
                <div className="p-5 bg-ashh-lightgray/30 border border-gray-100 rounded-2xl flex flex-col justify-between hover:border-red-100 transition-all">
                  <div>
                    <h4 className="font-outfit text-sm font-bold text-gray-800 mb-1">Reset Views &amp; Likes</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Setel ulang seluruh statistik tayangan &amp; suka semua karya menjadi 0.</p>
                  </div>
                  <button 
                    onClick={resetAnalytics}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    Reset Statistik
                  </button>
                </div>

                {/* Reset Database Card */}
                <div className="p-5 bg-ashh-lightgray/30 border border-gray-100 rounded-2xl flex flex-col justify-between hover:border-red-100 transition-all">
                  <div>
                    <h4 className="font-outfit text-sm font-bold text-red-700 mb-1">Reset Setelan Pabrik</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">Kembalikan portofolio ke desain &amp; isi bawaan template semula.</p>
                  </div>
                  <button 
                    onClick={revertToDefault}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    Revert Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'works':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-outfit tracking-tight">Gallery Works</h2>
                <p className="text-gray-500 text-sm mt-1">Design, edit, showcase, and license your vector illustrations</p>
              </div>
              <button 
                onClick={openAddWorkModal}
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Plus size={16}/> Add Masterpiece
              </button>
            </div>

            {/* Artwork List Grid */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50/80 text-gray-700 uppercase font-bold text-xs tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-5">Artwork Preview</th>
                      <th className="px-6 py-5">Title</th>
                      <th className="px-6 py-5">Category</th>
                      <th className="px-6 py-5">Commission Price</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {works.map(work => (
                      <tr key={work.id} className="hover:bg-ashh-lightgray/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="relative w-12 h-15 bg-ashh-lightgray rounded-lg overflow-hidden border border-gray-100 p-0.5">
                            <Image 
                              src={work.src} 
                              alt={work.title} 
                              fill 
                              className="object-cover rounded-md"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 font-outfit text-base">
                          <div className="flex items-center gap-2">
                            {work.title}
                            <button 
                              onClick={() => toggleFeaturedWork(work)}
                              title={work.featured ? 'Featured creation (Click to remove)' : 'Feature this artwork'}
                            >
                              <Star 
                                size={16} 
                                className={`transition-transform hover:scale-125 ${work.featured ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-ashh-lightgray/50 rounded-full text-xs font-semibold text-gray-600 border border-gray-100">
                            {work.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-800">{work.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            work.status === 'Published' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : work.status === 'Draft' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            {work.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-3 text-gray-400">
                            <button 
                              onClick={() => openEditWorkModal(work)}
                              className="p-1.5 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Edit Details"
                            >
                              <Edit2 size={16}/>
                            </button>
                            <button 
                              onClick={() => deleteWork(work.id)}
                              className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Work"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {works.length === 0 && (
                <div className="text-center py-16 text-gray-400 italic text-sm">
                  No artworks in portfolio. Create your first masterpiece using the button above!
                </div>
              )}
            </div>
          </div>
        );
      case 'categories':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 self-start">
              <h3 className="font-outfit text-xl font-bold text-gray-900 mb-2">Create Category</h3>
              <p className="text-gray-500 text-xs mb-6">Create customizable categories for your illustrations</p>
              
              <form onSubmit={addCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Category Name</label>
                  <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Traditional Art, Poster" 
                    className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Create
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100">
              <h3 className="font-outfit text-xl font-bold text-gray-900 mb-2">Manage Categories</h3>
              <p className="text-gray-500 text-xs mb-6">View and prune categories used in your gallery filter tabs</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center justify-between p-4 bg-ashh-lightgray/30 border border-gray-100 rounded-2xl group hover:border-ashh-softpink transition-all">
                    <span className="font-semibold text-gray-800 text-sm font-outfit">{cat}</span>
                    {cat !== 'All' && (
                      <button 
                        onClick={() => removeCategory(cat)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-white transition-colors"
                        title={`Delete ${cat}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 max-w-4xl">
            <h3 className="font-outfit text-2xl font-bold text-gray-900 mb-2">Edit About & Hero Profile</h3>
            <p className="text-gray-500 text-xs mb-8">Personalize the biography, software tags, and direct social URLs shown on the home page</p>

            {bio ? (
              <form onSubmit={saveBioChanges} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={bio.name}
                      onChange={e => handleBioTextChange('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm font-semibold text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Instagram Username / Handle</label>
                    <input 
                      type="text" 
                      value={bio.username}
                      onChange={e => handleBioTextChange('username', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm font-semibold text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-ashh-softpink/10 p-5 rounded-2xl border border-ashh-softpink/20">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ashh-accentpink mb-2">Foto Profile / About Me (URL)</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan URL foto untuk bagian Tentang Saya..."
                      value={bio.avatarUrl || ''}
                      onChange={e => handleBioTextChange('avatarUrl', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-transparent focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm font-mono text-xs text-gray-900"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">Ubah foto di bagian &quot;Tentang Saya&quot;. Kosongkan untuk menggunakan SVG bawaan.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ashh-accentpink mb-2">Foto Hero Utama / Banner (URL)</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan URL foto untuk bagian Hero Utama..."
                      value={bio.heroUrl || ''}
                      onChange={e => handleBioTextChange('heroUrl', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-transparent focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm font-mono text-xs text-gray-900"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">Ubah foto di bagian &quot;Hero / Karya Utama&quot;. Kosongkan untuk menggunakan SVG bawaan.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Hero Profile Title</label>
                  <input 
                    type="text" 
                    value={bio.title}
                    onChange={e => handleBioTextChange('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Hero Intro Statement</label>
                  <textarea 
                    rows={2}
                    value={bio.intro}
                    onChange={e => handleBioTextChange('intro', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm text-gray-700 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bio Paragraph 1</label>
                    <textarea 
                      rows={5}
                      value={bio.aboutText1}
                      onChange={e => handleBioTextChange('aboutText1', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm text-gray-700 leading-relaxed"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Bio Paragraph 2</label>
                    <textarea 
                      rows={5}
                      value={bio.aboutText2}
                      onChange={e => handleBioTextChange('aboutText2', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm text-gray-700 leading-relaxed"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Direct Contact Email</label>
                    <input 
                      type="email" 
                      value={bio.email}
                      onChange={e => handleBioTextChange('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">WhatsApp Contact Number</label>
                    <input 
                      type="text" 
                      value={bio.whatsapp}
                      onChange={e => handleBioTextChange('whatsapp', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Creative Software Toolkit</label>
                    <button 
                      type="button" 
                      onClick={addSoftwareTag}
                      className="text-xs text-ashh-accentpink font-bold flex items-center gap-1 hover:underline"
                    >
                      + Add Software Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bio.softwares.map((sw, index) => (
                      <div key={index} className="flex items-center gap-1 bg-ashh-lightgray border border-gray-200 pl-3 pr-1 py-1 rounded-xl text-xs font-semibold text-gray-800">
                        <input 
                          type="text" 
                          value={sw} 
                          onChange={e => handleSoftwareChange(index, e.target.value)}
                          className="bg-transparent outline-none w-24 border-b border-transparent focus:border-ashh-accentpink font-medium py-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeSoftwareTag(index)}
                          className="text-gray-400 hover:text-red-500 hover:bg-white p-1 rounded-md"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-400 italic text-sm">Loading bio credentials...</p>
            )}
          </div>
        );
      case 'messages':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List Side */}
            <div className="lg:col-span-1 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden self-start">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h3 className="font-outfit text-xl font-bold text-gray-900">Inbox</h3>
                <p className="text-gray-500 text-xs mt-1">Commision requests and contact forms</p>
              </div>
              <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    onClick={() => viewMessageDetail(msg)}
                    className={`p-5 flex items-start gap-3 transition-all hover:bg-ashh-lightgray/10 cursor-pointer ${
                      !msg.read ? 'bg-ashh-softpink/10 border-l-4 border-ashh-accentpink' : 'opacity-85'
                    } ${selectedMessage?.id === msg.id ? 'bg-ashh-softpink/20' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`truncate text-sm ${!msg.read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{msg.name}</span>
                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2">{msg.date}</span>
                      </div>
                      <p className={`text-xs truncate font-semibold mb-1 ${!msg.read ? 'text-gray-900' : 'text-gray-600'}`}>{msg.subject}</p>
                      <p className="text-xs text-gray-400 truncate leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-12 text-gray-400 italic text-sm">
                    Inbox is perfectly clear!
                  </div>
                )}
              </div>
            </div>

            {/* Detail View side */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 min-h-[450px] flex flex-col">
              {selectedMessage ? (
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                      <div>
                        <h4 className="font-outfit text-2xl font-bold text-gray-900">{selectedMessage.name}</h4>
                        <span className="text-xs text-gray-400 font-semibold font-mono block mt-1">{selectedMessage.email}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-ashh-lightgray border border-gray-100 text-gray-500 rounded-full text-xs font-semibold">
                          Date: {selectedMessage.date}
                        </span>
                        <button 
                          onClick={(e) => deleteMessage(selectedMessage.id, e)}
                          className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg text-gray-400 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="py-6">
                      <span className="text-[10px] font-bold uppercase text-ashh-accentpink tracking-widest block mb-1">Subject</span>
                      <h5 className="font-outfit text-lg font-bold text-gray-900 mb-4">{selectedMessage.subject}</h5>
                      
                      <div className="bg-ashh-lightgray/30 p-6 rounded-2xl border border-gray-50 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex gap-4">
                    <a 
                      href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                      className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
                    >
                      <Mail size={14} /> Reply via Email
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                  <MessageSquare size={48} className="text-gray-200 mb-4 animate-pulse" />
                  <p className="text-sm font-semibold">No message selected</p>
                  <p className="text-xs text-gray-400 mt-1">Select an email from the left sidebar to read details & reply</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 max-w-2xl">
            <h3 className="font-outfit text-2xl font-bold text-gray-900 mb-2">Settings & SEO Policies</h3>
            <p className="text-gray-500 text-xs mb-8">Maintain details regarding meta descriptions, license guidelines, or platform access controls</p>

            {settings ? (
              <form onSubmit={saveSettingsChanges} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Meta Page Title (SEO)</label>
                  <input 
                    type="text" 
                    value={settings.seoTitle}
                    onChange={e => setSettings({ ...settings, seoTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm font-semibold text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Meta Page Description</label>
                  <textarea 
                    rows={3}
                    value={settings.seoDescription}
                    onChange={e => setSettings({ ...settings, seoDescription: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm text-gray-700 leading-relaxed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Commercial Pricing Policies & Licensing Note</label>
                  <textarea 
                    rows={4}
                    value={settings.pricingPolicy}
                    onChange={e => setSettings({ ...settings, pricingPolicy: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-2 focus:ring-ashh-accentpink/20 outline-none transition-all text-sm text-gray-700 leading-relaxed"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save size={16} /> Save Settings
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-400 italic text-sm">Loading system settings...</p>
            )}
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <ShieldAlert size={48} className="mb-4 text-gray-300" />
            <p>This module is currently in development.</p>
          </div>
        );
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'works', icon: ImageIcon, label: 'Gallery Works' },
    { id: 'categories', icon: Tags, label: 'Categories' },
    { id: 'about', icon: User, label: 'About & Hero' },
    { id: 'messages', icon: MessageSquare, label: 'Inbox Messages' },
    { id: 'settings', icon: Settings, label: 'Settings & SEO' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-ashh-softpink/30 via-ashh-white to-ashh-lavender/30 px-4 sm:px-6 py-12 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-ashh-softpink/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-ashh-lavender/30 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(233,168,200,0.18)] w-full max-w-md border border-gray-100 relative overflow-hidden z-10"
        >
          {/* Accent decoration line */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-ashh-softpink via-ashh-accentpink to-purple-400"></div>
          
          <div className="text-center mb-8 pt-4">
            <div className="inline-flex p-4 bg-ashh-softpink/20 rounded-full text-ashh-accentpink mb-4 shadow-sm animate-bounce">
              <Lock size={28} />
            </div>
            <h1 className="font-outfit text-3xl font-bold text-gray-900 mb-2">Creative Studio</h1>
            <p className="text-gray-500 text-sm font-medium">Authorized admin access for @luaveren</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <User size={13} className="text-ashh-accentpink" /> Username
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Masukkan username..."
                  className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-4 focus:ring-ashh-softpink/20 outline-none transition-all text-sm font-semibold text-gray-800" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                <Key size={13} className="text-ashh-accentpink" /> Password
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Masukkan password..."
                  className="w-full px-4 py-3 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink focus:ring-4 focus:ring-ashh-softpink/20 outline-none transition-all text-sm font-semibold text-gray-800" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Divider line */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-300 text-[10px] font-bold uppercase tracking-widest">ATAU</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ashh-accentpink hover:text-ashh-accentpink/80 transition-colors py-2 px-4 rounded-xl hover:bg-ashh-softpink/10 cursor-pointer"
            >
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ashh-lightgray/50 flex flex-col md:flex-row relative">
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40 shadow-xs">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 hover:bg-gray-50 rounded-xl text-gray-700 cursor-pointer"
        >
          <Menu size={24} />
        </button>
        <span className="font-outfit text-lg font-bold text-gray-900 tracking-tight">
          Ashh<span className="text-ashh-accentpink">.</span> <span className="text-[9px] font-bold uppercase tracking-widest text-ashh-accentpink bg-ashh-softpink/30 px-1.5 py-0.5 rounded ml-1">Creator</span>
        </span>
        <Link 
          href="/" 
          className="text-xs font-bold uppercase text-ashh-accentpink hover:underline px-2 py-1"
        >
          Web
        </Link>
      </div>

      {/* Backdrop overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-xs z-45"
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white border-r border-gray-100 fixed h-full z-50 md:z-10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h1 className="font-outfit text-2xl font-bold text-gray-900 tracking-tight">
              Ashh<span className="text-ashh-accentpink">.</span> <span className="text-[10px] font-bold uppercase tracking-widest text-ashh-accentpink bg-ashh-softpink/30 px-2 py-0.5 rounded ml-1">Creator</span>
            </h1>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <div className="py-6 overflow-y-auto">
            <nav className="space-y-1.5 px-3">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      activeTab === item.id 
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10 scale-[1.02]' 
                        : 'text-gray-600 hover:bg-ashh-lightgray/40 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} /> {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="p-4 border-t border-gray-50 bg-gray-50/20">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-3 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 p-4 sm:p-8 pt-20 md:pt-8 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dynamic Modal for Adding/Editing Masterpieces */}
      <AnimatePresence>
        {isWorkModalOpen && (
          <div className="fixed inset-0 z-50 bg-gray-900/45 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-outfit text-xl font-bold text-gray-900">
                  {editingWork ? 'Edit Artwork' : 'Create Masterpiece'}
                </h3>
                <button onClick={() => setIsWorkModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">&times;</button>
              </div>

              <form onSubmit={saveWork} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={workTitle} 
                      onChange={e => setWorkTitle(e.target.value)}
                      placeholder="e.g. Starry Garden" 
                      className="w-full px-4 py-2.5 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink outline-none text-sm font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Category</label>
                    <select 
                      value={workCategory} 
                      onChange={e => setWorkCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white outline-none text-sm font-semibold"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Description</label>
                  <textarea 
                    rows={3} 
                    value={workDescription} 
                    onChange={e => setWorkDescription(e.target.value)}
                    placeholder="Short poetic description..." 
                    className="w-full px-4 py-2.5 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink outline-none text-sm text-gray-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Price / Value Label</label>
                    <input 
                      type="text" 
                      value={workPrice} 
                      onChange={e => setWorkPrice(e.target.value)}
                      placeholder="e.g. IDR 450,000" 
                      className="w-full px-4 py-2.5 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink outline-none text-sm font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Status</label>
                    <select 
                      value={workStatus} 
                      onChange={e => setWorkStatus(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white outline-none text-sm font-semibold"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Hidden">Hidden</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Artwork Source Type</label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setWorkSrcType('preset')}
                      className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        workSrcType === 'preset'
                          ? 'border-ashh-accentpink bg-ashh-softpink/20 font-bold text-ashh-accentpink'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      Vector Preset (SVG)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorkSrcType('custom')}
                      className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        workSrcType === 'custom'
                          ? 'border-ashh-accentpink bg-ashh-softpink/20 font-bold text-ashh-accentpink'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      Custom Image URL
                    </button>
                  </div>

                  {workSrcType === 'preset' ? (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Select Artwork Vector Theme Preset</label>
                      <div className="grid grid-cols-2 gap-2">
                        {SVG_PRESETS.map(preset => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setSelectedPreset(preset.name)}
                            className={`p-3 rounded-xl border text-xs text-left font-semibold transition-all cursor-pointer ${
                              selectedPreset === preset.name 
                                ? 'border-ashh-accentpink bg-ashh-softpink/20 font-bold' 
                                : 'border-gray-100 hover:bg-gray-50 bg-white'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Custom Image Source (URL)</label>
                      <input 
                        type="text" 
                        value={workSrc} 
                        onChange={e => setWorkSrc(e.target.value)}
                        placeholder="Paste image address URL (e.g. https://...)" 
                        className="w-full px-4 py-2.5 rounded-xl bg-ashh-lightgray/50 border border-transparent focus:bg-white focus:border-ashh-accentpink outline-none text-xs font-mono font-bold"
                        required={workSrcType === 'custom'}
                      />
                      <p className="text-[10px] text-gray-400 mt-1">Masukkan URL link gambar karya yang di-host di internet.</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="featured-check" 
                    checked={workFeatured} 
                    onChange={e => setWorkFeatured(e.target.checked)}
                    className="w-4 h-4 text-ashh-accentpink border-gray-300 rounded focus:ring-ashh-accentpink"
                  />
                  <label htmlFor="featured-check" className="text-xs font-semibold text-gray-600 cursor-pointer uppercase tracking-wider">
                    Feature this artwork on top showcase banner
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsWorkModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
                  >
                    {editingWork ? 'Update Artwork' : 'Publish Masterpiece'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
