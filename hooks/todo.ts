"use server";
import { auth } from "@/auth";
import { getUserByEmail } from "./user";
import db from "@/lib/db";

export async function getTodoBySessionUserId() {
  const sessionUser = await auth();
  if (!sessionUser) {
    return null;
  }
  const user = await getUserByEmail(sessionUser?.user?.email!);
  return await db.todo.findMany({
    where: {
      userId: user?.id,
    },
  });
}
