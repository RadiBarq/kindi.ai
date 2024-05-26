import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import prismaDB from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 400 },
      );
    }

    // Retrieve the user from the database
    const user = await prismaDB.user.findUnique({ where: { email } });

    if (!user || typeof user.password !== "string") {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordMatch = await compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    return NextResponse.json({ message: "success" });
  } catch (e) {
    console.log({ e });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}