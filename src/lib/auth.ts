import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import prisma from "@/lib/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { compare } from "bcrypt";
import prismaDB from "@/lib/db/prisma";
import { encode, decode } from "next-auth/jwt";
import { z } from "zod";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const email = credentials?.email ?? "";
        const password = credentials?.password ?? "";

        if (!email || !password) {
          console.error("Email or password not found");
          return null;
        }

        if (!z.string().email().safeParse(email).success) {
          console.error("Invalid email fromat found!");
          return null;
        }

        // Retrieve the user from the database
        const user = await prismaDB.user.findUnique({ where: { email } });

        if (!user || typeof user.password !== "string") {
          return null;
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("jwt callback", { token, user });
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("session callback", { session, token });

      const dbUser = await prismaDB.user.findUnique({
        where: {
          email: token.email!.toLowerCase(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          projects: {
            include: {
              project: true,
            },
          },
        },
      });

      const sessionUser =
        dbUser != null
          ? {
              ...session.user,
              accessToken: token.sub,
              id: dbUser.id,
              email: dbUser.email,
              image: dbUser.image,
              emailVerified: dbUser.emailVerified?.toISOString(),
              projects: dbUser.projects.map((projectUser) => {
                return {
                  id: projectUser.project.id,
                  name: projectUser.project.name,
                  role: projectUser.role,
                };
              }),
            }
          : null;
      return {
        ...session,
        user: {
          ...sessionUser,
        },
      };
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in with info: ${user}`);
    },
  },
  debug: true,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
  },
  jwt: { encode, decode },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
