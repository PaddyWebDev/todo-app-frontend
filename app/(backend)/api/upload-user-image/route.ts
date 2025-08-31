import { getUserByEmail } from "@/hooks/user";
import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const { email, image } = await request.json();
    if (!email || !image) {
      return new NextResponse("Email and Image is required", { status: 400 });
    }

    if (!(await getUserByEmail(email))) {
      return new NextResponse("User not found", { status: 404 });
    }

    await db.user.update({
      where: {
        email: email,
      },
      data: {
        image,
      },
    });
    return new NextResponse("Image updated successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
