import Link from 'next/link';
import { Instagram, Twitter, Dribbble, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
          
          <div className="text-center md:text-left">
            <Link href="#home" className="font-outfit text-3xl font-bold tracking-tight mb-2 block">
              Ashh<span className="text-ashh-accentpink">.</span>
            </Link>
            <p className="text-gray-400 text-sm">@luaveren — Visual Artist & Illustrator</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold text-gray-300 mb-4 uppercase text-xs tracking-wider">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="mailto:ashvianmadrestya@gmail.com" className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2"><Mail size={14}/> ashvianmadrestya@gmail.com</a></li>
                <li><a href="https://wa.me/62856470853307" className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2"><Phone size={14}/> +62 856-4708-53307</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-300 mb-4 uppercase text-xs tracking-wider">Media Sosial</h4>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-ashh-accentpink hover:text-white transition-all"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-ashh-accentpink hover:text-white transition-all"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-ashh-accentpink hover:text-white transition-all"><Dribbble size={18} /></a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Ashh. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
