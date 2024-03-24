"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo_small.png";
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

export default function NavBar() {
  return (
    <div className="p-4 shadow">
      <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} alt="Kindi AI Logo" width={40} height={40} />
          <span className="text-lg  font-bold">Kindi AI</span>
        </Link>
        <Menu />
        <div className="flex items-center gap-6">
          <Link className=" text-gray-700 hover:text-gray-800" href="/sign-in">
            Sign in
          </Link>
          <Button>
            <Link className="text" href="/sign-up">
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
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Why Kindi AI</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-1">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      {whyKindiAI[0].title}
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
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
          <NavigationMenuTrigger>Why Kindi AI</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {whyKindiAI.slice(1).map((element) => (
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
              Documentation
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
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground  text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
