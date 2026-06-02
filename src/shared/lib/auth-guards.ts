import { auth } from "@/auth";

// "ADMIN" is accepted for sessions issued before the role was renamed to
// "Administrador"; those JWTs keep the old label until the user re-logs in.
const ADMIN_ROLES = ["Administrador", "ADMIN"];

export function esAdmin(rol: string | undefined | null): boolean {
  return !!rol && ADMIN_ROLES.includes(rol);
}

type AdminCheck =
  | { ok: true; userId: number; rol: string }
  | { ok: false; status: 401 | 403; error: string };

/** Require an authenticated Administrador. Use at the top of admin-only routes. */
export async function requireAdmin(): Promise<AdminCheck> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, status: 401, error: "No autorizado" };
  }
  const rol = session.user.rol;
  if (!esAdmin(rol)) {
    return { ok: false, status: 403, error: "Requiere rol Administrador" };
  }
  return {
    ok: true,
    userId: session.user.userId as number,
    rol: rol as string,
  };
}
