import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
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

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const ownerId = session.user?.userId as number;
  const { id } = await params;

  const tarea = await prisma.tarea.findUnique({
    where: { id: Number(id) },
    include: { lista: true },
  });

  if (!tarea || tarea.ownerId !== ownerId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json(mapToITarea(tarea));
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const ownerId = session.user?.userId as number;
  const { id } = await params;

  const tarea = await prisma.tarea.findUnique({ where: { id: Number(id) } });
  if (!tarea || tarea.ownerId !== ownerId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateTareaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updated = await prisma.tarea.update({
    where: { id: Number(id) },
    data: {
      ...(data.listaId !== undefined && { listaId: data.listaId }),
      ...(data.nombre !== undefined && { nombre: data.nombre }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
      // Convert YYYY-MM-DD string to Date stored as UTC midnight
      ...(data.fecha !== undefined && {
        fecha: new Date(data.fecha + "T00:00:00.000Z"),
      }),
      ...(data.horaInicio !== undefined && { horaInicio: data.horaInicio }),
      ...(data.horaFin !== undefined && { horaFin: data.horaFin }),
      ...(data.color !== undefined && { color: data.color }),
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
  const ownerId = session.user?.userId as number;
  const { id } = await params;

  const tarea = await prisma.tarea.findUnique({ where: { id: Number(id) } });
  if (!tarea || tarea.ownerId !== ownerId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  await prisma.tarea.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
