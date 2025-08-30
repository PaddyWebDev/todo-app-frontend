import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "@/hooks/user";
import { loginSchema } from "@/schema/form-schema";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

const AuthConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = await loginSchema.safeParseAsync(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            return null;
          }

          const verifyPass = await bcryptjs.compare(password, user.password);
          if (verifyPass) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
} satisfies NextAuthConfig;

export default AuthConfig;
