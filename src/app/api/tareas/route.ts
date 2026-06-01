import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import { createTareaSchema } from "@/shared/validation/tarea.schema";
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

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const ownerId = session.user?.userId as number;

  const { searchParams } = req.nextUrl;
  const fecha = searchParams.get("fecha");
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");

  let fechaFilter: Record<string, unknown> = {};
  if (fecha) {
    // Exact day: match from 00:00:00Z to end of day in UTC
    fechaFilter = {
      fecha: {
        gte: new Date(fecha + "T00:00:00.000Z"),
        lte: new Date(fecha + "T23:59:59.999Z"),
      },
    };
  } else if (desde && hasta) {
    fechaFilter = {
      fecha: {
        gte: new Date(desde + "T00:00:00.000Z"),
        lte: new Date(hasta + "T23:59:59.999Z"),
      },
    };
  }

  const rows = await prisma.tarea.findMany({
    where: { ownerId, ...fechaFilter },
    include: { lista: true },
    orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
  });

  return NextResponse.json(rows.map(mapToITarea));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const ownerId = session.user?.userId as number;

  const body = await req.json();
  const parsed = createTareaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Verify the lista exists and belongs to this user
  const lista = await prisma.listaTarea.findFirst({
    where: { id: data.listaId, ownerId },
  });
  if (!lista) {
    return NextResponse.json(
      { error: "Lista no encontrada o sin acceso" },
      { status: 404 }
    );
  }

  const created = await prisma.tarea.create({
    data: {
      listaId: data.listaId,
      ownerId,
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      fecha: new Date(data.fecha + "T00:00:00.000Z"),
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      // Use provided color, else fall back to the lista's default
      color: data.color ?? lista.colorDefault ?? null,
      completada: false,
    },
    include: { lista: true },
  });

  return NextResponse.json(mapToITarea(created), { status: 201 });
}
