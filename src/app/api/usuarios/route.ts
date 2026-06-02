import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "@/shared/lib/auth-guards";
import { createUsuarioSchema } from "@/shared/validation/usuario.schema";
import type { IUsuario } from "@/modules/usuarios/domain/entities/Usuario.entities";
import type { Usuario, Rol } from "@prisma/client";

type UsuarioWithRol = Usuario & { rol: Rol };

// Note: passwordHash is intentionally never returned to the client.
function mapToIUsuario(row: UsuarioWithRol): IUsuario {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    activo: row.activo,
    rolId: row.rolId,
    rolNombre: row.rol.nombre,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const rows = await prisma.usuario.findMany({
    include: { rol: true },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(rows.map(mapToIUsuario));
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const body = await req.json();
  const parsed = createUsuarioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const exists = await prisma.usuario.findUnique({
    where: { email: data.email },
  });
  if (exists) {
    return NextResponse.json(
      { error: "Ya existe un usuario con ese email" },
      { status: 409 },
    );
  }

  const created = await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      passwordHash: await bcrypt.hash(data.password, 10),
      rolId: data.rolId,
      activo: data.activo ?? true,
    },
    include: { rol: true },
  });
  return NextResponse.json(mapToIUsuario(created), { status: 201 });
}
