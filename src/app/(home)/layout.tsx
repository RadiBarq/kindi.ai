import React from "react";
import NavBar from "./_components/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="m-auto p-4">{children}</main>
    </>
  );
}
