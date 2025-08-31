import { getUserByEmail } from "@/hooks/user";
import db from "@/lib/db";
import { getVerificationTokenByToken } from "@/lib/verification-token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
      return new NextResponse("Token is required", { status: 400 });
    }
    const hasExpired = new Date(existingToken.expiresAt) < new Date();

    if (hasExpired) {
      return new NextResponse("Token Has Expired!", { status: 400 });
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return new NextResponse("Email Doesn't Exist", { status: 404 });
    }


    if(existingUser.emailVerified){
      return new NextResponse("User is already verified", { status: 409 });
    }

    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}