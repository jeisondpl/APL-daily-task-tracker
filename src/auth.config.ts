import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no DB client, no hashing lib. Imported by middleware.ts.
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.rol = user.rol;
        token.userId = Number(user.id);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // JWT type augmentation is unreliable under pnpm's nested module
        // resolution (@auth/core is not hoisted), so cast token claims explicitly.
        session.user.rol = token.rol as string | undefined;
        session.user.userId = token.userId as number | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
