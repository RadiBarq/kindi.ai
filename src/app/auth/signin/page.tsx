import { getProviders, signIn } from "next-auth/react";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

async function fetchProviders() {
  const session = await getServerSession(authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    redirect("/dashboard");
  }

  return await getProviders();
}

export default async function SignIn() {
  const providers = await fetchProviders();
  if (!providers) {
    return;
  }
  return (
    <div className="m-auto flex min-h-screen max-w-7xl flex-col items-center justify-between gap-0">
      Hello world
    </div>
  );
}
