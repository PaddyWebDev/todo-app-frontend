import { hashPassword } from "@/hooks/password";
import { getUserById } from "@/hooks/user";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) return new NextResponse("UserId is required", { status: 400 });
    const { password } = await request.json();

    const checkIfUserExist = await getUserById(userId);
    if (!checkIfUserExist) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (!checkIfUserExist.password) {
      return new NextResponse(
        "This account doesn't support email password login",
        { status: 400 }
      );
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await hashPassword(password),
      },
    });

    return new NextResponse("Password Updated", { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
