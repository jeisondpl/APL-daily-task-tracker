import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "@/shared/lib/auth-guards";
import { updateUsuarioSchema } from "@/shared/validation/usuario.schema";
import type { IUsuario } from "@/modules/usuarios/domain/entities/Usuario.entities";
import type { Usuario, Rol } from "@prisma/client";

type UsuarioWithRol = Usuario & { rol: Rol };

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

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id } = await params;

  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(id) },
    include: { rol: true },
  });
  if (!usuario) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  return NextResponse.json(mapToIUsuario(usuario));
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id } = await params;

  const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });
  if (!usuario) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateUsuarioSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Reject duplicate email (only when it actually changes).
  if (data.email && data.email !== usuario.email) {
    const other = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (other) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 409 },
      );
    }
  }

  const updated = await prisma.usuario.update({
    where: { id: Number(id) },
    data: {
      ...(data.nombre !== undefined && { nombre: data.nombre }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.rolId !== undefined && { rolId: data.rolId }),
      ...(data.activo !== undefined && { activo: data.activo }),
      // Re-hash only when a non-empty password is provided.
      ...(data.password
        ? { passwordHash: await bcrypt.hash(data.password, 10) }
        : {}),
    },
    include: { rol: true },
  });
  return NextResponse.json(mapToIUsuario(updated));
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id } = await params;

  if (guard.userId === Number(id)) {
    return NextResponse.json(
      { error: "No podés eliminar tu propia cuenta" },
      { status: 400 },
    );
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });
  if (!usuario) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  await prisma.usuario.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
