import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prismaDB from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof name !== "string"
    ) {
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

    // Check if the user is already registered
    const existingUser = await prismaDB.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email is already registered." },
        { status: 400 },
      );
    }

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
    return NextResponse.json({ message: "success" });
  } catch (e) {
    console.log({ e });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
