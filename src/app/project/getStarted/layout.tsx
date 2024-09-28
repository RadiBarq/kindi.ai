import SideMenu from "../_components/SideMenu";
import Navbar from "../_components/Navbar";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = headers();
  const pathname = headerList.get("x-current-path") ?? "";
  const session = await getServerSession(authOptions);
  const projects = session?.user.projects ?? [];

  if (projects.length > 0) {
    redirect(`/project/${projects[0].id}`);
  }

  if (!session) {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen bg-white p-4 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
      {projects && (
        <div>
          <Navbar
            withProjectSettings={false}
            projectId={null}
            pathname={pathname}
            projects={projects}
            user={{
              email: session?.user.email,
              profilePicture: session?.user.image,
            }}
          />
          <SideMenu
            withProjectSettings={false}
            projectId={null}
            pathname={pathname}
            projects={projects}
            user={{
              email: session?.user.email,
              profilePicture: session?.user.image,
              name: session?.user.name,
            }}
          />
          {<main className="overflow-auto lg:ml-52">{children}</main>}
        </div>
      )}
    </div>
  );
}
