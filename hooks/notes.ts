"use server";

import db from "@/lib/db";
import { Note } from "@prisma/client";

export async function getNoteById(id: string): Promise<Note | null> {
  return await db.note.findUnique({
    where: {
      id: id,
    },
  });
}

export async function getNotesBySessionUser(
  id: string
): Promise<Note[] | null> {
  if (!id) {
    return [];
  }

  return await db.note.findMany({
    where: {
      userId: id,
    },
  });
}

