import type { Metadata } from 'next';
import { Poppins, Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Ashh - @luaveren Portfolio',
  description: 'Visual Artist & Illustrator Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${jakarta.variable} ${outfit.variable} scroll-smooth`}>
      <body className="bg-ashh-lightgray text-gray-900 font-jakarta min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
