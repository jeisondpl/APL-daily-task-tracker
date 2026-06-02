import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "@/shared/lib/auth-guards";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const roles = await prisma.rol.findMany({
    orderBy: { id: "asc" },
    select: { id: true, nombre: true },
  });
  return NextResponse.json(roles);
}
