import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/backend/lib/prisma";
import { getRedis } from "@/backend/payments/queues/connection";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const lockKey = `login-lock:${email}`;
        const failKey = `login-fail:${email}`;

        try {
          const redis = getRedis();
          const locked = await redis.exists(lockKey);
          if (locked) return null;

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;

          const passwordMatches = await compare(credentials.password as string, user.password);

          if (!passwordMatches) {
            const fails = await redis.incr(failKey);
            await redis.expire(failKey, LOCKOUT_SECONDS);
            if (fails >= MAX_ATTEMPTS) {
              await redis.set(lockKey, "1", "EX", LOCKOUT_SECONDS);
              await redis.del(failKey);
            }
            return null;
          }

          await redis.del(failKey, lockKey);
          return { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image };
        } catch {
          // Redis unavailable — fall back to auth without lockout
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;
          const passwordMatches = await compare(credentials.password as string, user.password);
          if (!passwordMatches) return null;
          return { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
        token.image = user.image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        session.user.image = token.image as string | null | undefined;
      }
      return session;
    },
  },
});
