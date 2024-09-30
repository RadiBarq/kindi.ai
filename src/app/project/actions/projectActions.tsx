"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaDB from "@/lib/db/prisma";

export async function getProject(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  const userId = session.user.id ?? "";
  const userProject = await prismaDB.projectUser.findFirst({
    where: {
      projectId: projectId,
      userId: userId,
    },
    include: {
      project: true,
    },
  });

  if (!userProject) {
    throw Error(
      "Cannot find the project or you don't have access to the requested project.",
    );
  }

  return userProject.project;
}
