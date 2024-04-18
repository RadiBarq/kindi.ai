import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import logo from "@/assets/home_pyramid.png";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="m-auto flex min-h-screen max-w-7xl flex-col items-center justify-between">
      <div className="mx-auto flex w-full flex-col-reverse items-center justify-around gap-4 p-12 md:flex-row">
        <div className="w-full max-w-sm items-center font-mono text-sm lg:flex">
          <div className="relative mx-auto flex h-[30rem] max-w-sm flex-col items-start border border-black/[0.2] p-4 dark:border-white/[0.2]">
            <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
            <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />
            <EvervaultCard text="The new age of customer support copilot" />
            <h2 className="mt-4 text-sm font-light text-black dark:text-white">
              Start using Kindi AI for free
            </h2>
            <p className="mt-4 rounded-full border border-black/[0.2] px-2 py-0.5 text-sm font-light text-black dark:border-white/[0.2] dark:text-white">
              <Link href="/register">Get started</Link>
            </p>
          </div>
        </div>
        <Image
          className="w-full max-w-sm shadow-lg shadow-gray-400 sm:max-w-sm md:max-w-sm lg:max-w-lg xl:max-w-xl"
          src={logo}
          alt="Pyramid hero image"
          width={1000}
        />
      </div>
    </div>
  );
}
