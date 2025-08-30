import bcrypt from "bcryptjs";

export async function hashPassword(
  password: string,
  saltRounds: number = 10
): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashPassword: string) {
  return await bcrypt.compare(password, hashPassword);
}
