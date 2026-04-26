import { Nav } from '@/components/Nav';
import { Hero } from '@/components/sections/Hero';
import { PainPoints } from '@/components/sections/PainPoints';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { WhatsAppDemo } from '@/components/sections/WhatsAppDemo';
import { ContentRepurposer } from '@/components/sections/ContentRepurposer';
import { CarePlans } from '@/components/sections/CarePlans';
import { Footer } from '@/components/Footer';
import { MainScene } from '@/components/three/Scene';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* 3D Background Layer */}
      <MainScene />
      
      {/* Scrollable Content Layer */}
      <div className="relative z-10">
        <Nav />
        <Hero />
        <PainPoints />
        <ProductGrid />
        <WhatsAppDemo />
        <ContentRepurposer />
        <CarePlans />
        {/* Placeholder for Section 7: Growth Audit */}
        {/* Placeholder for Section 10: Content Hub */}
        <Footer />
      </div>
    </main>
  );
}
