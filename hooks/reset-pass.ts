"use server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { PasswordResetToken } from "@prisma/client";
import { z } from "zod";
import { updatePasswordSchema } from "@/schema/form-schema";
import { getUserByEmail } from "@/hooks/user";
import { hashPassword } from "./password";

export async function getPasswordResetTokenByToken(
  token: string
): Promise<PasswordResetToken> {
  try {
    const passwordToken = await db.passwordResetToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!passwordToken) {
      throw new Error("Token not found");
    }

    return passwordToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export async function getPasswordResetTokenByEmail(
  email: string
): Promise<PasswordResetToken | null> {
  try {
    const passwordToken = await db.passwordResetToken.findFirst({
      where: {
        email: email,
      },
    });

    return passwordToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function generatePasswordResetToken(
  email: string
): Promise<PasswordResetToken> {
  const token = uuidv4();
  const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt: expiresIn,
    },
  });

  return newToken;
}

export async function updatePassword(
  formData: z.infer<typeof updatePasswordSchema>,
  token: string
): Promise<string> {
  if (!token) {
    throw new Error("Token is required");
  }

  const validatedFields = updatePasswordSchema.safeParse(formData);

  if (!validatedFields.success) {
    throw new Error("Invalid Password Type");
  }

  const { currentPassword, confirmUpdatedPassword } = validatedFields.data;

  if (currentPassword !== confirmUpdatedPassword) {
    throw new Error("Password Doesn't Match");
  }

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    throw new Error("Invalid Token");
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();

  if (hasExpired) {
    throw new Error("Token has expired");
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    throw new Error("Email doesn't exist");
  }

  const newPass = await hashPassword(currentPassword, 11);

  await db.user.update({
    data: {
      password: newPass,
    },
    where: {
      id: existingUser.id,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return "Password updated";
}
