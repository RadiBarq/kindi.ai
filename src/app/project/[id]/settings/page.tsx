import type { Metadata } from "next";
import ProjectMembers from "./component/ProjectMembers";
import ErrorMessage from "@/components/misc/Error";
import { getProjectMembers, deleteProjectMember } from "./actions";
import { hasAccess } from "@/lib/user/projectAccess";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isOwner } from "@/lib/user/projectRoles";

export const metadata: Metadata = {
  title: "Project settings | Kindi AI",
};

export default async function Settings({ params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const session = await getServerSession(authOptions);
    const members = await getProjectMembers(projectId);
    const userId = session?.user.id ?? "";
    const hasDeleteAccess = hasAccess({
      projectId: projectId,
      scope: "members:delete",
      session: session,
    });
    return (
      <div className="flex max-w-7xl flex-col items-start justify-start gap-10 p-10">
        {/* Header */}
        <div className="text-4xl font-bold">Settings</div>
        <ProjectMembers
          members={members}
          hasDeleteAccess={hasDeleteAccess}
          currentUserId={userId}
          isOwner={isOwner(projectId, session)}
          deleteProjectMemberAction={deleteProjectMember}
        />
      </div>
    );
  } catch (error: any) {
    console.error(error);
    return (
      <div className="px-10 py-32">
        <ErrorMessage withImage={false} message={error.message} />
      </div>
    );
  }
}
