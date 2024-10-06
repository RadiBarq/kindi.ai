"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaDB from "@/lib/db/prisma";

export async function getAllModels() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw Error("Operation is not allowed; you need to authenticate first.");
  }

  const result = await prismaDB.aIModel.findMany();
  return result;
}
