"use server";
import prismaDB from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import {
  ProjectMembers,
  ProjectUserInvitesWithSentByUser,
  ProjectUserInviteWithSentByUser,
} from "./types/projects";
import { revalidatePath } from "next/cache";
import { Project, ProjectRole, ProjectUser } from "@prisma/client";
import { hasAccess } from "@/lib/user/projectAccess";
import { isOwner } from "@/lib/user/projectRoles";

// Project members
export async function getProjectMembers(
  projectId: string,
): Promise<ProjectMembers> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  if (
    !hasAccess({
      session: session,
      projectId,
      scope: "members:read",
    })
  ) {
    throw Error("Operation is not allowed; you don't have authorization");
  }

  const userId = session.user.id;
  const project = await prismaDB.projectUser.findFirst({
    where: {
      projectId: projectId,
      userId: userId,
    },
  });

  if (!project) {
    throw Error(
      "Cannot find the project or you don't have access to the requested project.",
    );
  }

  const users: ProjectMembers = await prismaDB.projectUser.findMany({
    where: {
      projectId,
    },
    include: {
      user: true,
    },
  });

  return users;
}

export async function deleteProjectMember(memberId: string, projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  const member: ProjectUser | null = await prismaDB.projectUser.findFirst({
    where: {
      id: memberId,
    },
  });

  if (!member) {
    throw Error("Cannot find member with the following id.");
  }

  if (!hasDeleteMemberAccess(member, session, projectId)) {
    throw Error("Operation is not allowed; you don't have authorization");
  }

  await prismaDB.projectUser.delete({
    where: {
      id: memberId,
    },
  });

  revalidatePath(`/project/${projectId}/settings`);
}

// Project invites
export async function createProjectInvite(
  projectId: string,
  email: string,
  role: ProjectRole,
  sentByUserId: string,
): Promise<ProjectUserInviteWithSentByUser> {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  if (
    !hasAccess({
      session: session,
      projectId: projectId,
      scope: "members:create",
    })
  ) {
    throw Error("Operation is not allowed; you don't have authorization");
  }

  const isUserAlreadyAMember = await prismaDB.projectUser.findFirst({
    where: {
      user: { email: email },
      projectId,
    },
  });

  if (isUserAlreadyAMember) {
    throw Error(
      "User with the same email is already a member of this project.",
    );
  }

  const isUserAlreadyInvited = await prismaDB.projectUserInvite.findFirst({
    where: {
      email,
      projectId,
    },
  });

  if (isUserAlreadyInvited) {
    throw Error(
      "User with the same email is already invited to this project. If you want to resend the invitation delete the current invitation and resend it again.",
    );
  }

  const memberInvite: ProjectUserInviteWithSentByUser =
    await prismaDB.projectUserInvite.create({
      data: {
        projectId,
        email,
        role,
        sentByUserId,
      },
      include: {
        sentByUser: true,
      },
    });

  // TODO Sent invitation email to the user here.
  revalidatePath(`/project/${projectId}/settings`);
  return memberInvite;
}

export async function getProjectInvites(
  projectId: string,
): Promise<ProjectUserInvitesWithSentByUser> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }
  if (
    !hasAccess({
      session: session,
      projectId,
      scope: "members:read",
    })
  ) {
    throw Error("Operation is not allowed; you don't have authorization");
  }

  const invites: ProjectUserInvitesWithSentByUser =
    await prismaDB.projectUserInvite.findMany({
      where: {
        projectId,
      },
      include: {
        sentByUser: true,
      },
    });

  return invites;
}

export async function deleteProjectInvite(id: string, projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  if (
    !hasAccess({
      session: session,
      projectId: projectId,
      scope: "members:delete",
    })
  ) {
    throw Error("Operation is not allowed; you don't have authorization");
  }

  await prismaDB.projectUserInvite.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/project/${projectId}/settings`);
}

export async function updateProjectName(
  projectName: string,
  projectId: string,
): Promise<Project> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  const hasUpdateProjectAccess = hasAccess({
    projectId: projectId,
    scope: "project:update",
    session: session,
  });

  if (!hasUpdateProjectAccess) {
    throw Error("Operation is not allowed; you don't have authorization");
  }

  // Update the project name in the database
  return (await prismaDB.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: projectName,
    },
  })) as Project;
}

function hasDeleteMemberAccess(
  member: ProjectUser,
  session: Session | null,
  projectId: string,
): boolean {
  if (
    !hasAccess({
      session: session,
      projectId: projectId,
      scope: "members:delete",
    })
  ) {
    return false;
  }

  const isCurrentUserOwner = isOwner(projectId, session);
  const currentUserId = session?.user.id;

  if (!isCurrentUserOwner) {
    return (
      (member.role === ProjectRole.MEMBER ||
        member.role === ProjectRole.VIEWER) &&
      member.userId !== currentUserId
    );
  }

  return member.userId !== currentUserId;
}
