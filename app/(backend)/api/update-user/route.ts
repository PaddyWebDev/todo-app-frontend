import { getUserByEmail } from "@/hooks/user";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const { name, email, oldEmail } = await request.json();

    const getUser = await getUserByEmail(oldEmail);
    if (!getUser) return new NextResponse("User not found", { status: 404 });

    if (getUser.email === email)
      return new NextResponse("Previous & current emails must be different.", {
        status: 409,
      });

    await db.user.update({
      where: {
        id: getUser.id,
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
