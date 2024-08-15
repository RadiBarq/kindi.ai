import { roleAccessRights, Scope } from "@/lib/constants/roleAccessRights";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import { ProjectRole } from "@prisma/client";

type HasAccessParams =
  | {
      role: ProjectRole;
      scope: Scope;
    }
  | {
      session: null | Session;
      projectId: string;
      scope: Scope;
    };

export const useHasAcecss = (p: { projectId: string; scope: Scope }) => {
  const { scope, projectId } = p;
  const session = useSession();
  if (!projectId) return false;
  return hasAccess({ session: session.data, scope, projectId });
};

export function hasAccess(p: HasAccessParams): boolean {
  const projectRole: ProjectRole | undefined =
    "role" in p
      ? p.role
      : p.session?.user?.projects.find((project) => project.id === p.projectId)
          ?.role;
  if (projectRole === undefined) return false;

  return roleAccessRights[projectRole].includes(p.scope);
}
