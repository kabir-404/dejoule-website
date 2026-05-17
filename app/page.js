import Navbar from "@/components/Navbar";
import HeroAndSticky from "@/components/HeroAndSticky";
import ReturnOnIntelligence from "@/components/ReturnOnIntelligence";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroAndSticky />
        <ReturnOnIntelligence />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
