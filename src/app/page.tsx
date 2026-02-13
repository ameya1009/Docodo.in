import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Methodology } from '@/components/sections/Methodology';
import { GTMToolkit } from '@/components/sections/GTMToolkit';
import { WhoThisIsFor } from '@/components/sections/WhoThisIsFor/index';
import { PortfolioSlider } from '@/components/sections/PortfolioSlider';
import { InfiniteMarquee } from '@/components/sections/InfiniteMarquee';
import { GrowthGrader } from '@/components/sections/GrowthGrader';
import { DifferentiationMatrix } from '@/components/sections/DifferentiationMatrix';
import { Starfield } from '@/components/ui/Starfield';

export default function Home() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Starfield />
      <Navbar />
      <Hero />
      <InfiniteMarquee />
      <Services />
      <Methodology />
      <GTMToolkit />
      <PortfolioSlider />
      <WhoThisIsFor />
      <GrowthGrader />
      <DifferentiationMatrix />
      <Footer />
    </main>
  );
}
