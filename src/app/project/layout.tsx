"use client";

import { SessionProvider } from "next-auth/react";
import SideMenu from "./_components/SideMenu";
import Navbar from "./_components/Navbar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import ErrorView from "@/components/misc/Error";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/").filter(Boolean);
  var projectId =
    pathSegments.length >= 2 && pathSegments[0] === "project"
      ? pathSegments[1]
      : "";
  const isGetStarted = pathname === "/project/getStarted";
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    const handleFetchProjectsResult = (projects: Project[]) => {
      if (projects.length > 0 && isGetStarted) {
        const firstProject = projects[0];
        router.replace(`/project/${firstProject.id}`);
        return;
      }

      setProjects(projects);
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: Project[] = await response.json();
        handleFetchProjectsResult(result);
      } catch (error: any) {
        console.error(error.message);
        setProjectsError(
          "Unexpected network issue happened, please try refreshing the page later.",
        );
      }
    };
    fetchProjects();
  }, [isGetStarted, router]);

  const handleProjectChange = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  return (
    <SessionProvider>
      <div className="relative min-h-screen bg-white p-4 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        {projects && (
          <div>
            <Navbar
              isGetStarted={isGetStarted}
              projectId={projectId}
              pathname={pathname}
              projects={projects}
              onProjectChange={handleProjectChange}
            />
            <SideMenu
              isGetStarted={isGetStarted}
              projectId={projectId}
              pathname={pathname}
              projects={projects}
              onProjectChange={handleProjectChange}
            />
            {!projectId && (
              <div className="overflow-auto lg:ml-48">Project not found</div>
            )}

            {projectId && (
              <main className="overflow-auto lg:ml-48">{children}</main>
            )}
          </div>
        )}

        <div className="m-auto flex h-screen w-full items-center justify-center">
          {!projects && !projectsError && (
            <div>
              <span className="loading loading-spinner w-16"></span>
              <div className="text-left text-lg font-medium">Loading...</div>
            </div>
          )}

          {projectsError && <ErrorView message={projectsError} />}
        </div>
      </div>
    </SessionProvider>
  );
}
