import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Pricing from "./_components/Pricing";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="m-auto flex flex-col items-center justify-between gap-0">
      <Hero />
      <Features />
      <Pricing />
      <CTA />
    </div>
  );
}
