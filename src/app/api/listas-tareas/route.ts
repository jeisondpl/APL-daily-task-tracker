import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { createListaSchema } from "@/shared/validation/lista.schema";
import type { IListaTarea } from "@/modules/listas-tareas/domain/entities/ListaTarea.entities";
import type { ListaTarea } from "@prisma/client";

type ListaWithCount = ListaTarea & { _count: { tareas: number } };

function mapToIListaTarea(row: ListaWithCount): IListaTarea {
  return {
    id: row.id,
    ownerId: row.ownerId,
    nombre: row.nombre,
    descripcion: row.descripcion ?? undefined,
    colorDefault: row.colorDefault ?? undefined,
    tareasCount: row._count.tareas,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const ownerId = session.user?.userId as number;

  const rows = await prisma.listaTarea.findMany({
    where: { ownerId },
    include: { _count: { select: { tareas: true } } },
    orderBy: { nombre: "asc" },
  });

  return NextResponse.json(rows.map(mapToIListaTarea));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const ownerId = session.user?.userId as number;

  const body = await req.json();
  const parsed = createListaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const created = await prisma.listaTarea.create({
    data: {
      ownerId,
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      colorDefault: data.colorDefault ?? undefined,
    },
    include: { _count: { select: { tareas: true } } },
  });

  return NextResponse.json(mapToIListaTarea(created), { status: 201 });
}
