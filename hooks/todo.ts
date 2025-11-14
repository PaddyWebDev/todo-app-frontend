"use server";

import db from "@/lib/db";
import { Todo } from "@prisma/client";

export async function getTodoBySessionUserId(id: string): Promise<Array<Todo>> {
  const todo = await db.todo.findMany({
    where: {
      userId: id,
    },
  });

  if (!todo.length || todo.length === 0) return [];
  return todo;
}
