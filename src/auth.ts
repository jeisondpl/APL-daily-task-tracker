import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/shared/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const email = credentials?.email as string;
          const password = credentials?.password as string;
          if (!email || !password) return null;

          const usuario = await prisma.usuario.findUnique({
            where: { email },
            include: { rol: true },
          });
          if (!usuario || !usuario.activo) return null;

          const ok = await bcrypt.compare(password, usuario.passwordHash);
          if (!ok) return null;

          return {
            id: String(usuario.id),
            name: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol.nombre,
          };
        } catch (err) {
          console.error("[auth] authorize threw:", err);
          return null;
        }
      },
    }),
  ],
});
