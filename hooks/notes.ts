"use server";

import prisma from "@/lib/db";
import { Note } from "@prisma/client";

export async function getNoteById(id: string): Promise<Note | null> {
  return await prisma.note.findUnique({
    where: {
      id: id,
    },
  });
}

export async function getNotesBySessionUser(id: string): Promise<Note[]> {
  return await prisma.note.findMany({
    where: {
      userId: id,
    },
  });
}
