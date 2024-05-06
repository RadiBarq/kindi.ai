import { getProviders, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
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
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button>Sign in with {provider.name}</button>
        </div>
      ))}
    </>
  );
}
