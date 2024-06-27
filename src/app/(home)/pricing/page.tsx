import CTA from "../_components/CTA";
import PricingView from "../_components/Pricing";

export default function Pricing() {
  return (
    <div className="m-auto flex flex-col items-center justify-between gap-0">
      <PricingView />
      <CTA />
    </div>
  );
}
