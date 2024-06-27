"use client";

import { SessionProvider } from "next-auth/react";
import SideMenu from "./_components/SideMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="relative min-h-screen bg-white p-4 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        <SideMenu />
        <main className="overflow-auto lg:ml-44">{children}</main>
      </div>
    </SessionProvider>
  );
}
