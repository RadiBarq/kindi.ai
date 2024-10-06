import prismaDB from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ProjectRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { openai } from "@/lib/openai";
import { z } from "zod";
import { env } from "process";

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
    const defaultModel = process.env.OPENAI_DEFAULT_MODEL ?? "gpt-4o";
    const projectAssistant = await openai.beta.assistants.create({
      instructions: "",
      name: `${projectName} Default`,
      tools: [{ type: "code_interpreter" }, { type: "file_search" }],
      model: defaultModel,
    });

    const result = await prismaDB.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name: projectName,
          defaultAssistantId: projectAssistant.id,
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
