"use server";
import prismaDB from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ProjectMembers } from "./types/projects";
import { revalidatePath } from "next/cache";

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
      projectId: projectId,
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
