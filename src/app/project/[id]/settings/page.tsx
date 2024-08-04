import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Kindi AI",
};

export default function Settings() {
  return (
    <div className="flex max-w-7xl flex-col items-start justify-start gap-10 p-10">
      {/* Header */}
      <div className="text-4xl font-bold">Settings</div>
      <div className="text-2xl font-bold">Project Members</div>
      
    </div>
  );
}
