import type { Metadata } from "next";
import ProjectMembers from "./component/ProjectMembers";
import ErrorMessage from "@/components/misc/Error";
import { getProjectMembers, getProjectInvites } from "./actions";
import { hasAccess } from "@/lib/user/projectAccess";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isOwner } from "@/lib/user/projectRoles";
import EditProjectName from "./component/EditProjectName";
import DangerZone from "./component/DangerZone";

export const metadata: Metadata = {
  title: "Project settings | Kindi AI",
};

export default async function Settings({ params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const session = await getServerSession(authOptions);
    const project = session?.user.projects.find(
      (project) => project.id === projectId,
    );
    const hasReadMembersAccess = hasAccess({
      projectId: projectId,
      scope: "members:read",
      session: session,
    });
    const hasDeleteMembersAccess = hasAccess({
      projectId: projectId,
      scope: "members:delete",
      session: session,
    });

    const hasCreateMembersAccess = hasAccess({
      projectId: projectId,
      scope: "members:create",
      session: session,
    });

    const hasUpdateProjectAccess = hasAccess({
      projectId: projectId,
      scope: "project:update",
      session: session,
    });

    const members = hasReadMembersAccess
      ? await getProjectMembers(projectId)
      : null;
    const invites = hasReadMembersAccess
      ? await getProjectInvites(projectId)
      : null;
    const userId = session?.user.id ?? "";

    return (
      <div className="flex w-full max-w-7xl flex-col items-start justify-start gap-10 p-10">
        {/* Header */}
        <div className="text-4xl font-bold">Settings</div>
        <div className="flex w-full flex-col justify-start gap-10 rounded-md border border-gray-400/70 p-10">
          {/* Project members */}
          {hasReadMembersAccess && members && invites && (
            <ProjectMembers
              members={members}
              hasDeleteMembersAccess={hasDeleteMembersAccess}
              hasCreateMembersAccess={hasCreateMembersAccess}
              currentUserId={userId}
              isOwner={isOwner(projectId, session)}
              projectId={projectId}
              invites={invites}
            />
          )}
          {/* Project name */}
          {project && hasUpdateProjectAccess && (
            <EditProjectName
              projectId={projectId}
              projectName={project.name ?? ""}
            />
          )}
          <DangerZone />
        </div>
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
