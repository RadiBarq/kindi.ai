"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo_small_2.svg";
import { signIn, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const whyKindiAI: { title: string; href: string; description: string }[] = [
  {
    title: "Incremental data Integration",
    href: "/",
    description:
      "Can be used while gradually supplying it with customers real time conversations and eliminating the need for time-consuming collection and processing of historical customer conversations.",
  },
  {
    title: "No integration needed with existing tools",
    href: "/",
    description:
      "Can be used as an external independent tool, no need to integrate with existing tools used by the support team.",
  },
  {
    title: "Multiple input data sources",
    href: "/",
    description:
      "Takes mulitple input formats to learn about your customer questions and issues, such as new and old customer convesations, company manuals and documentation files.",
  },
  {
    title: "Privacy focused",
    href: "/",
    description:
      "You have the option to permanently delete all your data at any time, with no additional copies stored elsewhere. We are considering offering local data hosting in the future.",
  },
];

const community: { title: string; href: string; description: string }[] = [
  {
    title: "Blog",
    href: "/",
    description:
      "Stories about AI customer support, and building an open source AI project.",
  },
  {
    title: "Documentation",
    href: "/",
    description: "The guide you need to easily understand how to use Kindi AI.",
  },
  {
    title: "Github",
    href: "/",
    description:
      "Track our development, inspect and review our code, open issues and contribute to our codebase.",
  },
  {
    title: "Updates",
    href: "/",
    description:
      "What's new updates in Kindi AI? We list major features releases.",
  },
];

export default function NavBar() {
  return (
    <div className="z-30 p-4">
      <div className="m-auto flex max-w-7xl flex-wrap items-center justify-around gap-3">
        <Link
          href="/"
          className="flex flex-col items-center sm:flex-row sm:gap-2"
        >
          <Image src={logo} alt="Kindi AI Logo" width={45} height={45} />
          <span className="pt-1 text-lg font-bold">Kindi AI</span>
        </Link>
        <Menu />
        <div className="flex items-center  gap-6">
          <Button onClick={() => signIn()}>Sign in</Button>
          <Button>
            <Link className="text" href="/auth/signup">
              Sign up for free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <NavigationMenu className="z-30">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Why Kindi AI</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      <p>{whyKindiAI[0].title}</p>
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {whyKindiAI[0].description}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <div className="flex flex-col gap-0">
                {whyKindiAI.slice(1).map((element) => (
                  <ListItem
                    key={element.title}
                    title={element.title}
                    href={element.href}
                  >
                    {element.description}
                  </ListItem>
                ))}
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Community</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {community.map((element) => (
                <ListItem
                  key={element.title}
                  title={element.title}
                  href={element.href}
                >
                  {element.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm  leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
