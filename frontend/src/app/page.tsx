import { Nav } from '@/components/Nav';
import { Hero } from '@/components/sections/Hero';
import { PainPoints } from '@/components/sections/PainPoints';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { WhatsAppDemo } from '@/components/sections/WhatsAppDemo';
import { ContentRepurposer } from '@/components/sections/ContentRepurposer';
import { GrowthAudit } from '@/components/sections/GrowthAudit';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { WhyDocodo } from '@/components/sections/WhyDocodo';
import { ContentHub } from '@/components/sections/ContentHub';
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
        <GrowthAudit />
        <CaseStudies />
        <WhyDocodo />
        <ContentHub />
        <CarePlans />
        <Footer />
      </div>
    </main>
  );
}
