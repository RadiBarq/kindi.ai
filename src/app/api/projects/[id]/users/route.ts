import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismaDB from "@/lib/db/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const projectId = params.id;
    if (!session) {
      return NextResponse.json(
        {
          message: "Operation is not allowed; you need to authenticate first",
        },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const project = await prismaDB.projectUser.findFirst({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });

    if (!project) {
      // Adjusted condition to check if the project does NOT exist
      return NextResponse.json(
        {
          message:
            "Cannot find the project or you don't have access to the requested project.",
        },
        { status: 403 },
      );
    }

    const users = await prismaDB.projectUser.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log("Error fetching projects: ", error);
    return NextResponse.json(
      {
        message: "Error fetching projects. Please try again later.",
      },
      { status: 500 },
    );
  }
}
