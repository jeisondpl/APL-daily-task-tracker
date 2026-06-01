import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);
const PUBLIC = ["/login"];

export default auth((req) => {
  const isPublic = PUBLIC.some((p) => req.nextUrl.pathname.startsWith(p));
  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
