import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { GTMToolkit } from '@/components/sections/GTMToolkit';
import { WhoThisIsFor } from '@/components/sections/WhoThisIsFor/index';
import { PortfolioSlider } from '@/components/sections/PortfolioSlider';
import { InfiniteMarquee } from '@/components/sections/InfiniteMarquee';
import { GrowthGrader } from '@/components/sections/GrowthGrader';
import { Starfield } from '@/components/ui/Starfield';

export default function Home() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <Starfield />
      <Navbar />
      <Hero />
      <InfiniteMarquee />
      <Services />
      <GTMToolkit />
      <PortfolioSlider />
      <WhoThisIsFor />
      <GrowthGrader />
      <Footer />
    </main>
  );
}
