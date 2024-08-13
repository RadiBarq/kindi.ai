import SideMenu from "../_components/SideMenu";
import Navbar from "../_components/Navbar";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ErrorMessage from "@/components/misc/Error";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const projectId = params.id;
  const headerList = headers();
  const pathname = headerList.get("x-current-path") ?? "";
  console.log(`Path name is ${pathname}`);
  const session = await getServerSession(authOptions);
  const projects = session?.user.projects ?? [];

  if (!session) {
    redirect("/");
  }

  const isProjectFound = Boolean(
    projects.find((project) => project.id == projectId),
  );

  if (projects.length <= 0) {
    redirect("/project/getStarted");
  }

  return (
    <div className="relative min-h-screen bg-white p-4 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
      {projects && (
        <div>
          <Navbar
            withProjectSettings={isProjectFound}
            projectId={projectId}
            pathname={pathname}
            projects={projects}
            user={{
              email: session?.user.email,
              profilePicture: session?.user.image,
            }}
          />
          <SideMenu
            withProjectSettings={isProjectFound}
            projectId={projectId}
            pathname={pathname}
            projects={projects}
            user={{
              email: session?.user.email,
              profilePicture: session?.user.image,
              name: session?.user.name,
            }}
          />
          {isProjectFound && (
            <main className="overflow-auto lg:ml-48">{children}</main>
          )}

          {!isProjectFound && (
            <div className="px-10 py-32">
              <ErrorMessage
                withImage={false}
                message={"404 | Project Not Found"}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
