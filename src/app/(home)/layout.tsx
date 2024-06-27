import React from "react";
import NavBar from "./_components/NavBar";
import Footer from "./_components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-auto min-h-screen max-w-7xl p-4">
      <NavBar />
      <main className="m-auto p-4">{children}</main>
      <Footer />
    </div>
  );
}
