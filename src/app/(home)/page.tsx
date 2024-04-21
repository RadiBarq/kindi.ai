import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Pricing from "./_components/Pricing";

export default function Home() {
  return (
    <div className="m-auto flex min-h-screen max-w-7xl flex-col items-center justify-between gap-4">
      <Hero />
      <Features />
      <Pricing />
    </div>
  );
}
