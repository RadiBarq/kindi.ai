import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/main_logo@1x.svg";
import { version } from "@/../package.json";
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

interface SideMenu {
  isGetStarted: boolean;
  email: string;
  username: string;
  projectId: string;
  pathname: string;
}

export default function SideMenu({
  isGetStarted,
  email,
  username,
  projectId,
  pathname,
}: SideMenu) {
  const rootPath = `/project/${projectId}`;
  return (
    <div className="fixed hidden flex-col overflow-hidden rounded-xl border border-gray-200 bg-background px-4 py-6 text-foreground shadow-md shadow-gray-200 md:w-48 lg:flex">
      <div className="flex items-center justify-between">
        <Image className="h-auto" src={logo} alt="Kindi AI Logo" width={45} />
        <span className="text-lg font-bold">Kindi AI</span>
        <span className="text-xs font-medium">v{version}</span>
      </div>
      <nav className="mt-8 flex flex-col space-y-2">
        {!isGetStarted && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Main</h3>
            <Link
              href={`${rootPath}/`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              prefetch={false}
              data-active={pathname === rootPath}
            >
              <Bot className="h-5 w-5" />
              Copilot
            </Link>
            <Link
              href={`${rootPath}/conversations`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              prefetch={false}
              data-active={pathname === `${rootPath}/conversations`}
            >
              <MessageCircle className="h-5 w-5" />
              Conversations
            </Link>
            <Link
              href={`${rootPath}/datasources`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              prefetch={false}
              data-active={pathname === `${rootPath}/datasources`}
            >
              <Box className="h-5 w-5" />
              Datasources
            </Link>
            <Link
              href={`${rootPath}/settings`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              prefetch={false}
              data-active={pathname === `${rootPath}/settings`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </div>
        )}

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Support</h3>
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
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Project</h3>
          <ProjectSelectBox />
        </div>

        <div className="space-y-1 pt-8">
          <h3 className="text-sm font-medium text-muted-foreground">Profile</h3>
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
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </div>
  );
}

function ProjectSelectBox() {
  return (
    <Select>
      <SelectTrigger className="">
        <SelectValue placeholder="Project" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="project1">Project 1</SelectItem>
          <SelectItem value="project2">Project 2</SelectItem>
          <SelectItem value="project3">Project 3</SelectItem>
          <SelectItem value="project4">Project 4</SelectItem>
          <SelectItem value="project5">Project 5</SelectItem>
          <SelectItem value="project6">Project 6</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
