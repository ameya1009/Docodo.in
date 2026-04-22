import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { ProblemSolution } from '@/components/ProblemSolution';
import { Services, GrowthStack, CarePlans, AuditCTA } from '@/components/Sections';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <ProblemSolution />
      <Services />
      <GrowthStack />
      <CarePlans />
      <AuditCTA />
      <Footer />
    </main>
  );
}
