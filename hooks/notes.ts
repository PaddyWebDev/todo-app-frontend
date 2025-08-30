"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { Note } from "@prisma/client";
import { getUserByEmail } from "./user";


export async function getNoteById(id: string): Promise<Note | null> {
  return await db.note.findUnique({
    where: {
      id: id,
    },
  });
}

export async function getNotesBySessionUserId(): Promise<Note[] | null> {
  const sessionUser = await auth();
  if (!sessionUser) {
    return null;
  }
  const user = await getUserByEmail(sessionUser?.user?.email!);
  return await db.note.findMany({
    where: {
      userId: user?.id,
    },
  });
}

