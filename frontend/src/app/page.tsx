import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <FeaturesGrid />
      <Footer />
    </main>
  );
}
