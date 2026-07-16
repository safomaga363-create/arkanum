import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  HeroSection,
  FeaturesSection,
  RanksSection,
  CTASection,
} from "@/components/landing/hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <RanksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
