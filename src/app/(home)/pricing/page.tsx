import CTA from "../_components/CTA";
import PricingView from "../_components/Pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Kindi AI",
  description: "The new age of customer support copilot is here",
};

export default function Pricing() {
  return (
    <div className="m-auto flex flex-col items-center justify-between gap-0">
      <PricingView />
      <CTA />
    </div>
  );
}
