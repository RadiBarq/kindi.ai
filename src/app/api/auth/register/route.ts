import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prismaDB from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    // YOU MAY WANT TO ADD SOME VALIDATION HERE
    const hashedPassword = await hash(password, 10);

    await prismaDB.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
        image: null,
      },
    });
    console.log({ name, email, password });
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
