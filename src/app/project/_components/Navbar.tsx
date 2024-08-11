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
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import CreateProjectDialog from "../_components/CreateProjectDialog";

interface NavbarProps {
  withProjectSettings: boolean;
  pathname: string;
  user: {
    email: string | null | undefined;
    profilePicture: string | null | undefined;
  };
  projectId: string | null;
  projects: {
    id: string;
    name: string | null;
    role: any;
  }[];
}

export default function Navbar({
  withProjectSettings,
  pathname,
  projects,
  projectId,
  user,
}: NavbarProps) {
  const rootPath = `/project/${projectId}`;
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  const router = useRouter();
  const closeSheet = () => {
    setIsOpen(false);
  };

  const onClickLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleOnNewProjectCreated = (projectId: string) => {
    setCreateProjectDialogOpen(false);
    closeSheet();
    router.push(`${projectId}`);
  };

  const onProjectChange = (projectId: string) => {
    router.push(`${projectId}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:hidden">
      <Dialog
        open={feedbackDialogOpen || createProjectDialogOpen}
        onOpenChange={
          feedbackDialogOpen
            ? setFeedbackDialogOpen
            : setCreateProjectDialogOpen
        }
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
              {withProjectSettings && projectId && (
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
                <ProjectSelectBox
                  projects={projects}
                  projectId={projectId}
                  onProjectChange={onProjectChange}
                />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        {feedbackDialogOpen && <FeedbackDialog />}
        {createProjectDialogOpen && (
          <CreateProjectDialog onProjectCreated={handleOnNewProjectCreated} />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              {!user.profilePicture && <UserRound />}
              {user.profilePicture && (
                <Image
                  className="h-auto"
                  src={user.profilePicture}
                  alt="User profile image"
                  width={45}
                  height={45}
                />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
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

interface ProjectSelectBoxProps {
  projectId: string | null;
  projects: {
    id: string;
    name: string | null;
    role: any;
  }[];
  onProjectChange: (projectId: string) => void;
}

function ProjectSelectBox({
  projects,
  projectId,
  onProjectChange,
}: ProjectSelectBoxProps) {
  const onValueChange = (value: string) => {
    const selectedProject = projects.find((project) => project.name === value);
    if (!selectedProject) {
      return;
    }
    onProjectChange(selectedProject.id);
  };

  const initialProject = projects.find((project) => project.id === projectId);
  return (
    <Select onValueChange={onValueChange} value={initialProject?.name ?? ""}>
      <SelectTrigger className="text-lg">
        <SelectValue className="text-lg" placeholder="Project" />
      </SelectTrigger>
      <SelectContent className="items-start">
        <SelectGroup className="items-start">
          {projects.map((project) => (
            <SelectItem
              key={project.id}
              className="text text-lg"
              value={project.name ?? ""}
            >
              {project.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
