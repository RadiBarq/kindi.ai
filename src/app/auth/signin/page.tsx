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
    redirect("/");
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
      <div className="relative flex h-[60rem] w-full items-center justify-center bg-white bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        <div className="pointer-events-none absolute inset-0 flex w-full items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-black"></div>

        <div className="relative mx-auto flex h-[30rem] max-w-sm flex-col items-start border border-black/[0.2] p-4 dark:border-white/[0.2]">
          <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
          <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
          <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
          <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />
          <EvervaultCard text="Welcome back to  Kindi AI" />
          <h2 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
            You don&apos;t have an account?
          </h2>
          <p className="mt-4 rounded-full border border-black/[0.2] px-2 py-0.5 text-sm font-light text-black dark:border-white/[0.2] dark:text-white">
            <Link href="/register">Sign Up here</Link>
          </p>
        </div>
        <div className="flex flex-col justify-center gap-4">
          
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button>Sign in with {provider.name}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
