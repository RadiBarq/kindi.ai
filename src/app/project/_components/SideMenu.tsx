"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/main_logo@1x.svg";
import { version } from "@/../package.json";
import { Dialog } from "@/components/ui/dialog";
import {
  Bot,
  MessageCircle,
  Box,
  Settings,
  CircleHelp,
  Mail,
  ChevronDown,
  Library,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import FeedbackDialog from "./FeedbackDialog";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Plus } from "lucide-react";
import CreateProjectDialog from "../_components/CreateProjectDialog";
import { Project } from "@prisma/client";

interface SideMenuProps {
  isGetStarted: boolean;
  projectId: string;
  pathname: string;
  projects: Project[];
  onProjectChange: (projectId: string) => void;
  onProjectCreated: (projectId: string) => void;
}

export default function SideMenu({
  isGetStarted,
  projectId,
  pathname,
  projects,
  onProjectChange,
  onProjectCreated,
}: SideMenuProps) {
  const rootPath = `/project/${projectId}`;
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const { data: session } = useSession();
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  const username = session?.user.name ?? "";
  const email = session?.user.email ?? "";

  const onClickLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleNewProjectCreated = (projectId: string) => {
    setCreateProjectDialogOpen(false);
    onProjectCreated(projectId);
  };

  return (
    <Dialog
      open={feedbackDialogOpen || createProjectDialogOpen}
      onOpenChange={
        feedbackDialogOpen ? setFeedbackDialogOpen : setCreateProjectDialogOpen
      }
    >
      <div className="fixed hidden flex-col overflow-hidden rounded-xl border border-gray-200 bg-background px-4 py-6 text-foreground shadow-md shadow-gray-200 md:w-48 lg:flex">
        {feedbackDialogOpen && <FeedbackDialog />}
        {createProjectDialogOpen && (
          <CreateProjectDialog onProjectCreated={handleNewProjectCreated} />
        )}
        <div className="flex items-center justify-between">
          <Image className="h-auto" src={logo} alt="Kindi AI Logo" width={45} />
          <span className="text-lg font-bold">Kindi AI</span>
          <span className="text-xs font-medium">v{version}</span>
        </div>
        <nav className="mt-8 flex flex-col space-y-2">
          {!isGetStarted && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                Main
              </h3>
              <Link
                href={`${rootPath}/`}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                data-active={pathname === rootPath}
              >
                <Bot className="h-5 w-5" />
                Copilot
              </Link>
              <Link
                href={`${rootPath}/conversations`}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                data-active={pathname === `${rootPath}/conversations`}
              >
                <MessageCircle className="h-5 w-5" />
                Conversations
              </Link>
              <Link
                href={`${rootPath}/datasources`}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                data-active={pathname === `${rootPath}/datasources`}
              >
                <Box className="h-5 w-5" />
                Datasources
              </Link>
              <Link
                href={`${rootPath}/settings`}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                data-active={pathname === `${rootPath}/settings`}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </div>
          )}

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              Support
            </h3>
            <Link
              href={`${rootPath}/help`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              prefetch={false}
              data-active={pathname === `${rootPath}/help`}
            >
              <CircleHelp className="h-5 w-5" />
              Help
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              prefetch={false}
              onClick={() => setFeedbackDialogOpen(true)}
            >
              <Mail className="h-5 w-5" />
              Feedback
            </Link>

            <Link
              href="/docs"
              target="_blank"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              prefetch={false}
            >
              <Library className="h-5 w-5" />
              Docs
            </Link>
          </div>
          <div className="space-y-2">
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
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

          <div className="space-y-1 pt-8">
            <h3 className="text-sm font-medium text-muted-foreground">
              Profile
            </h3>

            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full px-3">
                    <div className="flex w-full items-start justify-between ">
                      <div className="text-sm font-medium">{username}</div>
                      <ChevronDown className="ml-2 mt-1 h-4 w-4" color="gray" />
                    </div>
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
            )}
          </div>
        </nav>
      </div>
    </Dialog>
  );
}

interface ProjectSelectBoxProps {
  projectId: string;
  projects: Project[];
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
      <SelectTrigger>
        <SelectValue placeholder="Project" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="items-start">
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.name ?? ""}>
              <div className="w-full text-start">{project.name}</div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
