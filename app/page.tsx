import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Categories from '@/components/Categories';
import FeaturedWorks from '@/components/FeaturedWorks';
import Gallery from '@/components/Gallery';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Categories />
      <FeaturedWorks />
      <Gallery />
      <Skills />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
