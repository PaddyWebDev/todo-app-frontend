import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import { fetchPasswordByEmail, getUserById } from "@/hooks/user";
import { loginSchema } from "./schema/form-schema";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { getUserByEmail } from "@/hooks/user";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
export type ExtendedUser = DefaultSession["user"] & {
  id: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const {
  auth,
  signOut,
  signIn,
  handlers: { GET, POST },
} = NextAuth({
  pages: {
    signIn: "/guest/Login",
    error: "/guest/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow non credential user to login without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      // Prevent SignIn without email Verification
      const existingUser = await getUserById(user.id!);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      return true;
    },

    async jwt({ token, trigger, session }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      if (trigger === "update" && session) {
        // Update the token with new session data
        token = { ...token, ...session.user };
      }

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },

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

          const user = await fetchPasswordByEmail(email);
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
});
