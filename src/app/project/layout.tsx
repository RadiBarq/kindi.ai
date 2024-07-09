"use client";

import { SessionProvider } from "next-auth/react";
import SideMenu from "./_components/SideMenu";
import Navbar from "./_components/Navbar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  var projectId =
    pathSegments.length >= 2 && pathSegments[0] === "project"
      ? pathSegments[1]
      : "";
  const isGetStarted = pathname === "/project/getStarted";
  return (
    <SessionProvider>
      <div className="relative min-h-screen bg-white p-4 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        <Navbar
          isGetStarted={isGetStarted}
          email="grayllow@gmail.com"
          pictureURL={null}
          projectId="1234"
          pathname={pathname}
        />
        <SideMenu
          isGetStarted={isGetStarted}
          projectId={projectId}
          pathname={pathname}
        />
        {!projectId && (
          <div className="overflow-auto lg:ml-48">Project not found</div>
        )}

        {projectId && (
          <main className="overflow-auto lg:ml-48">{children}</main>
        )}
      </div>
    </SessionProvider>
  );
}
