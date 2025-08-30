import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/hooks/user";
import { hashPassword } from "@/hooks/password";
import { generateVerificationToken } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/hooks/mail-hooks";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    const hashedPassword = await hashPassword(password, 10);

    if (await getUserByEmail(email)) {
      return new NextResponse("Email already in use", { status: 409 });
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return new NextResponse("Confirmation Email Sent", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
