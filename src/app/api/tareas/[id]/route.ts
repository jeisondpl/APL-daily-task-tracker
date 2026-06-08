import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { esAdmin } from "@/shared/lib/auth-guards";
import { prisma } from "@/shared/lib/prisma";
import { updateTareaSchema } from "@/shared/validation/tarea.schema";
import type { ITarea } from "@/modules/tareas/domain/entities/Tarea.entities";
import type { Tarea, ListaTarea } from "@prisma/client";

type TareaWithLista = Tarea & { lista: ListaTarea };

function mapToITarea(row: TareaWithLista): ITarea {
  return {
    id: row.id,
    listaId: row.listaId,
    listaNombre: row.lista.nombre,
    ownerId: row.ownerId,
    nombre: row.nombre,
    descripcion: row.descripcion ?? undefined,
    fecha: row.fecha.toISOString().slice(0, 10),
    horaInicio: row.horaInicio,
    horaFin: row.horaFin,
    color: row.color ?? undefined,
    completada: row.completada,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

type RouteContext = { params: Promise<{ id: string }> };

// An employee may only touch their own tasks; an admin may touch anyone's.
function canAccess(taskOwnerId: number, sessionUserId: number, rol?: string) {
  return esAdmin(rol) || taskOwnerId === sessionUserId;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const sessionUserId = session.user?.userId as number;
  const { id } = await params;

  const tarea = await prisma.tarea.findUnique({
    where: { id: Number(id) },
    include: { lista: true },
  });

  if (!tarea || !canAccess(tarea.ownerId, sessionUserId, session.user?.rol)) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json(mapToITarea(tarea));
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const sessionUserId = session.user?.userId as number;
  const { id } = await params;

  const tarea = await prisma.tarea.findUnique({ where: { id: Number(id) } });
  if (!tarea || !canAccess(tarea.ownerId, sessionUserId, session.user?.rol)) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateTareaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Only re-validate the list and re-derive the color when the list ACTUALLY
  // changes. Otherwise a simple "completada"/time edit must not fail just
  // because the task already points to a list owned by someone else
  // (pre-existing data inconsistency).
  let nuevoColor: string | undefined;
  if (data.listaId !== undefined && data.listaId !== tarea.listaId) {
    // Lists are global/shared — any existing list is usable by any task.
    const lista = await prisma.listaTarea.findUnique({
      where: { id: data.listaId },
    });
    if (!lista) {
      return NextResponse.json(
        { error: "Lista no encontrada" },
        { status: 400 },
      );
    }
    nuevoColor = lista.colorDefault;
  }

  const updated = await prisma.tarea.update({
    where: { id: Number(id) },
    data: {
      ...(data.listaId !== undefined && { listaId: data.listaId }),
      ...(data.nombre !== undefined && { nombre: data.nombre }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
      ...(data.fecha !== undefined && {
        fecha: new Date(data.fecha + "T00:00:00.000Z"),
      }),
      ...(data.horaInicio !== undefined && { horaInicio: data.horaInicio }),
      ...(data.horaFin !== undefined && { horaFin: data.horaFin }),
      ...(nuevoColor !== undefined && { color: nuevoColor }),
      ...(data.completada !== undefined && { completada: data.completada }),
    },
    include: { lista: true },
  });

  return NextResponse.json(mapToITarea(updated));
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const sessionUserId = session.user?.userId as number;
  const { id } = await params;

  const tarea = await prisma.tarea.findUnique({ where: { id: Number(id) } });
  if (!tarea || !canAccess(tarea.ownerId, sessionUserId, session.user?.rol)) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  await prisma.tarea.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
