import { ProjectRole } from "@prisma/client";
import { type Session } from "next-auth";

export function getRole(
  projectId: string,
  session: Session | null,
): ProjectRole | null {
  return session?.user?.projects.find((project) => project.id === projectId)
    ?.role;
}

export function isOwner(projectId: string, session: Session | null) {
  const role = getRole(projectId, session);
  return role === ProjectRole.OWNER;
}
