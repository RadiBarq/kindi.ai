import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import Link from "next/link";

export default function Feature() {
  return (
    <div>
      <div className="w-ful mt-8 flex w-screen justify-center bg-white font-mono text-sm bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        <div className="relative mx-32 my-12 flex h-full w-screen flex-col items-start border border-black/[0.2] p-10  dark:border-white/[0.2]">
          <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
          <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
          <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
          <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />
          <p className="bg-white text-3xl font-semibold">
            Ready to ditch customer support manuals?
          </p>
          <h2 className="text-md mt-4 font-semibold text-gray-900 dark:text-white">
            Start your free trial today
          </h2>
          <p className="mt-4 rounded-full border border-black/[0.2] px-2 py-0.5 text-sm font-light text-black dark:border-white/[0.2] dark:text-white">
            <Link href="/register">Get started</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
