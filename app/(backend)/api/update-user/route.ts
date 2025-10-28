import { getUserByEmail } from "@/hooks/user";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return new NextResponse("UserId is required", { status: 400 });
    }
    const { name, email, oldEmail } = await request.json();

    const checkIfUserExist = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
      },
    });

    if (!checkIfUserExist)
      return new NextResponse("User not found", { status: 404 });

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
      },
    });

    return new NextResponse("User updated successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
