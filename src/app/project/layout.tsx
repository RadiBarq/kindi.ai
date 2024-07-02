"use client";

import { SessionProvider } from "next-auth/react";
import SideMenu from "./_components/SideMenu";
import Navbar from "./_components/Navbar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGetStarted = pathname === "/project/getStarted";
  return (
    <SessionProvider>
      <div className="relative min-h-screen bg-white p-4 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        <Navbar isGetStarted={isGetStarted} />
        <SideMenu isGetStarted={isGetStarted} />
        <main className="overflow-auto lg:ml-48">{children}</main>
      </div>
    </SessionProvider>
  );
}
