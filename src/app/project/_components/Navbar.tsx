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
import FeedbackDialog from "./FeedbackDialog";
import { Dialog } from "@/components/ui/dialog";
const { version } = packageInfo;
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import CreateProjectDialog from "../_components/CreateProjectDialog";

interface NavbarProps {
  isGetStarted: boolean;
  projectId: string;
  pathname: string;
}
export default function Navbar({
  isGetStarted,
  projectId,
  pathname,
}: NavbarProps) {
  const rootPath = `/project/${projectId}`;
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  const { data: session } = useSession();
  const email = session?.user.email ?? "";
  const profilePicture = session?.user.image ?? "";
  const closeSheet = () => {
    setIsOpen(false);
  };

  const onClickLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleOnNewProjectCreated = () => {
    setCreateProjectDialogOpen(false);
    closeSheet();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:hidden">
      <Dialog
        open={feedbackDialogOpen || createProjectDialogOpen}
        onOpenChange={feedbackDialogOpen ? setFeedbackDialogOpen : setCreateProjectDialogOpen}
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Columns2 className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-xl ">
              <Link
                href="#"
                className="flex items-center gap-2"
                prefetch={false}
              >
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
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
                    prefetch={false}
                    onClick={closeSheet}
                    data-active={pathname === rootPath}
                  >
                    <Bot className="h-7 w-7" />
                    <div>Copilot</div>
                  </Link>
                  <Link
                    href={`${rootPath}/conversations`}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
                    prefetch={false}
                    onClick={closeSheet}
                    data-active={pathname === `${rootPath}/conversations`}
                  >
                    <MessageCircle className="h-7 w-7" />
                    Conversations
                  </Link>
                  <Link
                    href={`${rootPath}/datasources`}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
                    prefetch={false}
                    onClick={closeSheet}
                    data-active={pathname === `${rootPath}/datasources`}
                  >
                    <Box className="h-7 w-7" />
                    Datasources
                  </Link>
                  <Link
                    href={`${rootPath}/settings`}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
                    prefetch={false}
                    onClick={closeSheet}
                    data-active={pathname === `${rootPath}/settings`}
                  >
                    <Settings className="h-7 w-7" />
                    Settings
                  </Link>
                </>
              )}

              <Link
                href={`${rootPath}/help`}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
                prefetch={false}
                data-active={pathname === `${rootPath}/help`}
              >
                <CircleHelp className="h-7 w-7" />
                Help
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                onClick={() => setFeedbackDialogOpen(true)}
              >
                <Mail className="h-7 w-7" />
                Feedback
              </Link>
              <Link
                href="/docs"
                target="_blank"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                <Library className="h-7 w-7" />
                Docs
              </Link>
              <div className="space-y-1">
                <div className="flex flex-row items-center justify-between">
                  <h3 className="mb-2 text-lg font-medium text-muted-foreground">
                    Project
                  </h3>

                  <Button
                    onClick={() => setCreateProjectDialogOpen(true)}
                    variant="outline"
                    className="h-6 w-14 px-1"
                  >
                    <Plus className="h-4 w-4 " />
                    <div className="text-xs">New</div>
                  </Button>
                </div>
                <ProjectSelectBox />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        {feedbackDialogOpen && <FeedbackDialog />}
        {createProjectDialogOpen && (
          <CreateProjectDialog
            onCreateProjectSucceeded={handleOnNewProjectCreated}
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              {!profilePicture && <UserRound />}
              {profilePicture && (
                <Image
                  className="h-auto"
                  src={profilePicture}
                  alt="User profile image"
                  width={45}
                  height={45}
                />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={onClickLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
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
