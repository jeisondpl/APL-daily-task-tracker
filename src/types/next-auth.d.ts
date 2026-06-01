import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    rol?: string;
  }

  interface Session {
    user: {
      rol?: string;
      userId?: number;
    } & DefaultSession["user"];
  }
}
