import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { esAdmin } from "@/shared/lib/auth-guards";

// Role-based landing: admins manage from the dashboard; employees go to their
// own day. (Middleware already blocks unauthenticated access.)
export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");
  redirect(esAdmin(session.user?.rol) ? "/dashboard" : "/tareas");
}
