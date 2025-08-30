import { hashPassword, verifyPassword } from "@/hooks/password";
import { getUserById } from "@/hooks/user";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const { newPassword, userId } = await request.json();

    const checkIfUserExist = await getUserById(userId);
    if (!checkIfUserExist || !checkIfUserExist.password) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (await verifyPassword(newPassword, checkIfUserExist.password)) {
      return new NextResponse(
        "Previous & current passwords must be different.",
        { status: 409 }
      );
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await hashPassword(newPassword),
      },
    });

    return new NextResponse("Password Updated", { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
