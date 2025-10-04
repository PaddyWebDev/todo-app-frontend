"use server";

import db from "@/lib/db";

export async function getTodoBySessionUserId(id: string) {
  if (!id) {
    return [];
  }
  return await db.todo.findMany({
    where: {
      userId: id,
    },
  });
}
