"use client";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen items-center justify-center gap-10">
      Dashboard page
      <button
        onClick={() => {
          signOut({ callbackUrl: "/" });
        }}
      >
        Logout
      </button>
    </div>
  );
}
