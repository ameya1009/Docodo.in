import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { PortfolioPreview } from '@/components/sections/PortfolioPreview';
import { Starfield } from '@/components/ui/Starfield';

export default function Home() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Starfield />
      <Navbar />
      <Hero />
      <Services />
      <PortfolioPreview />
      <Footer />
    </main>
  );
}
