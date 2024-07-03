"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Bot,
  MessageCircle,
  Box,
  Settings,
  CircleHelp,
  Mail,
  Columns2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/main_logo@1x.svg";
import packageInfo from "@/../package.json";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { UserRound, Library } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
const { version } = packageInfo;

interface NavbarProps {
  isGetStarted: boolean;
  email: string;
  pictureURL: string | null;
  projectId: string;
}
export default function Navbar({
  isGetStarted,
  email,
  pictureURL,
  projectId,
}: NavbarProps) {
  const rootPath = `/project/${projectId}`;
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <Columns2 className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-xl ">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <Image
                className="h-auto"
                src={logo}
                alt="Kindi AI Logo"
                width={45}
              />
              <span className="text-lg font-bold">Kindi AI</span>
              <span className="text-sm">v{version}</span>
            </Link>
            {!isGetStarted && (
              <>
                <Link
                  href={`${rootPath}/`}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={closeSheet}
                >
                  <Bot className="h-7 w-7" />
                  <div>Copilot</div>
                </Link>
                <Link
                  href={`${rootPath}/conversations`}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={closeSheet}
                >
                  <MessageCircle className="h-7 w-7" />
                  Conversations
                </Link>
                <Link
                  href={`${rootPath}/datasources`}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={closeSheet}
                >
                  <Box className="h-7 w-7" />
                  Datasources
                </Link>
                <Link
                  href={`${rootPath}/settings`}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  prefetch={false}
                  onClick={closeSheet}
                >
                  <Settings className="h-7 w-7" />
                  Settings
                </Link>
              </>
            )}

            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              <CircleHelp className="h-7 w-7" />
              Help
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              <Mail className="h-7 w-7" />
              Feedback
            </Link>
            <Link
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              <Library className="h-7 w-7" />
              Docs
            </Link>
            <div className="space-y-1">
              <h3 className="mb-2 text-lg font-medium text-muted-foreground">
                Project
              </h3>
              <ProjectSelectBox />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <UserRound />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

function ProjectSelectBox() {
  return (
    <Select>
      <SelectTrigger className="text-lg">
        <SelectValue className="text-lg" placeholder="Project" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="items-start">
          <SelectItem className="items-start text-lg" value="project1">
            Project 1
          </SelectItem>
          <SelectItem className="text-lg" value="project2">
            Project 2
          </SelectItem>
          <SelectItem className="text-lg" value="project3">
            Project 3
          </SelectItem>
          <SelectItem className="text-lg" value="project4">
            Project 4
          </SelectItem>
          <SelectItem className="text-lg" value="project5">
            Project 5
          </SelectItem>
          <SelectItem className="text-lg" value="project6">
            Project 6
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
