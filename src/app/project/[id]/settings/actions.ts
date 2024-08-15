"use server";
import prismaDB from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import {
  ProjectMembers,
  ProjectUserInvitesWithSentByUser,
} from "./types/projects";
import { revalidatePath } from "next/cache";
import { ProjectRole } from "@prisma/client";
import { hasAccess } from "@/lib/user/projectAccess";
import { ProjectUserInvite } from "@prisma/client";

export async function getProjectMembers(
  projectId: string,
): Promise<ProjectMembers> {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
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

export async function deleteProjectMember(memberId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  await prismaDB.projectUser.delete({
    where: {
      id: memberId,
    },
  });

  revalidatePath("/project/settings");
}

export async function createNewProjectMemberInvite(
  projectId: string,
  email: string,
  role: ProjectRole,
  sentByUserId: string,
): Promise<ProjectUserInvite> {
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
    throw Error("Operation is not allowed; you are not authorization");
  }

  const memberInvite: ProjectUserInvite =
    await prismaDB.projectUserInvite.create({
      data: {
        projectId,
        email,
        role,
        sentByUserId,
      },
    });

  // TODO Sent invitation email to the user here.

  revalidatePath("/project/settings");
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
