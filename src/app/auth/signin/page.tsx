import { getProviders } from "next-auth/react";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import logo from "@/assets/logo_small_2.svg";
import GoogleButton from "@/components/ui/google-button";
import GithubButton from "@/components/ui/github-button";
import Footer from "@/app/(home)/_components/Footer";
import FormPage from "./form";

interface SignInProps {
  searchParams: { error: string };
}

export default async function SignIn({ searchParams: { error } }: SignInProps) {
  const providers = await fetchProviders();
  if (!providers) {
    return;
  }
  let errorMessage = getErrorMessage(error);
  return (
    <div className="m-auto flex min-h-screen max-w-7xl flex-col items-center justify-between gap-0 py-10">
      <div className="relative flex w-full  flex-col items-center justify-center gap-16 bg-white py-10 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        <div className="pointer-events-none absolute inset-0 flex w-full items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-black"></div>
        <div className="mx-auto flex w-full flex-row flex-wrap-reverse items-center justify-center gap-12 px-10">
          <div className="relative mx-auto  flex h-[30rem] max-w-xs flex-col items-start border border-black/[0.2] p-4 dark:border-white/[0.2] sm:max-w-sm md:max-w-sm">
            <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />
            <EvervaultCard text="Welcome back to the new age of customer support" />
            <h2 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
              Don&apos;t have an account?
            </h2>
            <p className="mt-4 rounded-full border border-black/[0.2] px-2 py-0.5 text-sm font-light text-black dark:border-white/[0.2] dark:text-white">
              <Link href="/auth/signup">Sign Up here</Link>
            </p>
          </div>

          <div className="relative mx-auto max-w-xs border  border-black/[0.2] p-16 dark:border-white/[0.2] sm:max-w-sm md:max-w-md lg:max-w-lg">
            <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />

            <div className="flex w-full flex-col justify-center gap-14">
              <Image
                className="mx-auto w-32 md:w-40"
                src={logo}
                alt="Kindi AI Logo"
                width={150}
                height={150}
              />
              <FormPage />
              <div className="flex w-full flex-col items-center justify-center gap-4">
                {Object.values(providers).map((provider) => (
                  <div key={provider.name}>
                    {provider.name === "Google" && (
                      <GoogleButton providerId={provider.id} />
                    )}
                    {provider.name === "GitHub" && (
                      <GithubButton providerId={provider.id} />
                    )}
                  </div>
                ))}
                {error && (
                  <p className="w-full text-center text-red-500">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-4">
        <Footer />
      </div>
    </div>
  );
}

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

function getErrorMessage(error: string) {
  switch (error) {
    case "OAuthSignin":
      return "There was an error during the sign-in process. Please try again.";
    case "OAuthCallback":
      return "There was an error handling the response from the OAuth provider. Please try again.";
    case "OAuthCreateAccount":
      return "We could not create your account using the OAuth provider. Please try again or use another sign-in method.";
    case "EmailCreateAccount":
      return "We could not create your account using the email provider. Please try again or use another sign-in method.";
    case "Callback":
      return "There was an error during the callback handling. Please try again.";
    case "OAuthAccountNotLinked":
      return "Your account is not linked with this OAuth provider. Please sign in using your original sign-in method.";
    case "EmailSignin":
      return "Sending the verification email failed. Please try again.";
    case "CredentialsSignin":
      return "The sign-in credentials are incorrect. Please check your details and try again.";
    case "SessionRequired":
      return "You need to be signed in to access this page. Please sign in and try again.";
    default:
      return "An unexpected error has occurred. Please try again.";
  }
}
