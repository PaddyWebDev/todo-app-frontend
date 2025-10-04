"use server";
import { auth } from "@/auth";
import db from "@/lib/db";
import { getVerificationTokenByToken } from "@/lib/verification-token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: {
      id: id,
    },
  });
}

export async function fetchPasswordByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      password: true,
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function checkUserExistByEmail(email: string) {
  return !db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
}
export async function checkUserExistById(id: string): Promise<Boolean> {
  return !!db.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });
}

export async function verifyUserEmail(token: string): Promise<string> {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    throw new Error("Missing Token");
  }
  const hasExpired = new Date(existingToken.expiresAt) < new Date();

  if (hasExpired) {
    throw new Error("Token Has Expired!");
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    throw new Error("Email Doesn't Exist");
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  return "Email Verified!";
}

export async function getSessionUser() {
  const user = await auth();
  return user;
}

export async function socialLogin(provider: "github" | "google") {
  await signIn(provider, {
    callbackUrl: DEFAULT_LOGIN_REDIRECT,
  });
}
