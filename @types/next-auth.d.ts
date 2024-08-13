import { DefaultSession } from "next-auth";
import { Project as PrismaProject } from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      emailVerified: string;
      accessToken: string | undefined;
      projects: {
        id: PrismaProject["id"];
        name: PrismaProject["name"];
        role: PrismaProject["role"];
      }[];
    } & DefaultSession["user"];
  }
}
