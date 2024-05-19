import Image from "next/image";
import logo from "@/assets/logo_small_2.svg";
import { getProviders, signIn } from "next-auth/react";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import FormPage from "./form";
import GoogleButton from "@/components/ui/google-button";

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

export default async function SignUp() {
  const providers = await fetchProviders();
  if (!providers) {
    return;
  }
  return (
    <div className="m-auto flex min-h-screen max-w-7xl flex-col items-center justify-between gap-0">
      <div className="relative flex h-[60rem] w-full flex-col items-center justify-center gap-16 bg-white bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        <div className="pointer-events-none absolute inset-0 flex w-full items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-black"></div>
        <Image src={logo} alt="Kindi AI Logo" width={200} height={200} />

        <div className="flex w-full flex-row items-center gap-52 px-16">
          <div className="relative mx-auto flex h-[30rem] max-w-sm flex-col items-start border border-black/[0.2] p-4 dark:border-white/[0.2]">
            <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />
            <EvervaultCard text="Welcome to the new age of customer support" />
            <h2 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
              Already have an account?
            </h2>
            <p className="mt-4 rounded-full border border-black/[0.2] px-2 py-0.5 text-sm font-light text-black dark:border-white/[0.2] dark:text-white">
              <Link href="/auth/signin">Sign In here</Link>
            </p>
          </div>
          <div className="flex w-full flex-col justify-center gap-14">
            <FormPage />
            <div className="flex w-full flex-col items-center justify-center gap-4">
              {Object.values(providers).map((provider) => (
                <div key={provider.name} className="">
                  {provider.name === "Google" && <GoogleButton />}
                  {provider.name === "GitHub" && (
                    <button className="w-full">
                      Sign in with {provider.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
