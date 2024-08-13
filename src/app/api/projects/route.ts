import prismaDB from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ProjectRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        message: "Operation is not allowed; you need to authenticate first",
      },
      { status: 401 },
    );
  }

  const userId = session.user.id;

  try {
    const validation = await validatePostRequestInputs(req);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error.errors[0].message,
        },
        { status: 400 },
      );
    }
    const { projectName } = validation.data;

    // Check if a project with the same name already exists
    const existingProject = await prismaDB.project.findUnique({
      where: { name: projectName, users: { some: { userId } } },
    });

    if (existingProject) {
      return NextResponse.json(
        {
          message:
            "A project with this name already exists. Please choose another name.",
        },
        { status: 400 },
      );
    }

    const result = await prismaDB.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name: projectName,
        },
      });

      await tx.projectUser.create({
        data: {
          projectId: newProject.id,
          userId: userId,
          role: ProjectRole.OWNER,
        },
      });

      return newProject;
    });
    revalidatePath("/project");
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating project: ", error);
    return NextResponse.json(
      {
        message: "Error creating project. Please try again later.",
      },
      { status: 500 },
    );
  }
}

export async function GET(_: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          message: "Operation is not allowed; you need to authenticate first",
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const projects = await prismaDB.project.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects: ", error);
    return NextResponse.json(
      {
        message: "Error fetching projects. Please try again later.",
      },
      { status: 500 },
    );
  }
}

async function validatePostRequestInputs(req: Request) {
  const projectSchema = z.object({
    projectName: z
      .string()
      .min(1, "Project name is required.")
      .max(100, "Project name must be at most 100 characters."),
  });

  const body = await req.json();
  const validation = projectSchema.safeParse(body);
  return validation;
}
