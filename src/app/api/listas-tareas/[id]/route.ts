import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { updateListaSchema } from "@/shared/validation/lista.schema";
import type { IListaTarea } from "@/modules/listas-tareas/domain/entities/ListaTarea.entities";
import type { ListaTarea, Usuario } from "@prisma/client";

type ListaWithCountAndOwner = ListaTarea & {
  _count: { tareas: number };
  owner: Pick<Usuario, "nombre">;
};

function mapToIListaTarea(row: ListaWithCountAndOwner): IListaTarea {
  return {
    id: row.id,
    ownerId: row.ownerId,
    ownerNombre: row.owner.nombre,
    nombre: row.nombre,
    descripcion: row.descripcion ?? undefined,
    colorDefault: row.colorDefault ?? undefined,
    esCompartida: row.esCompartida,
    tareasCount: row._count.tareas,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const ownerId = session.user?.userId as number;
  const { id } = await params;

  const lista = await prisma.listaTarea.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { tareas: true } }, owner: { select: { nombre: true } } },
  });

  if (!lista || lista.ownerId !== ownerId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json(mapToIListaTarea(lista));
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const ownerId = session.user?.userId as number;
  const { id } = await params;

  const lista = await prisma.listaTarea.findUnique({ where: { id: Number(id) } });
  if (!lista || lista.ownerId !== ownerId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateListaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updated = await prisma.listaTarea.update({
    where: { id: Number(id) },
    data: {
      ...(data.nombre !== undefined && { nombre: data.nombre }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
      ...(data.colorDefault !== undefined && { colorDefault: data.colorDefault }),
      ...(data.esCompartida !== undefined && { esCompartida: data.esCompartida }),
    },
    include: { _count: { select: { tareas: true } }, owner: { select: { nombre: true } } },
  });

  return NextResponse.json(mapToIListaTarea(updated));
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const ownerId = session.user?.userId as number;
  const { id } = await params;

  const lista = await prisma.listaTarea.findUnique({ where: { id: Number(id) } });
  if (!lista || lista.ownerId !== ownerId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  // Cascade to tareas is handled by Prisma schema's onDelete: Cascade
  await prisma.listaTarea.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
