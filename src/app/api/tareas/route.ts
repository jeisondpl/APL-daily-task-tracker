import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { esAdmin } from "@/shared/lib/auth-guards";
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
  const sessionUserId = session.user?.userId as number;
  const { searchParams } = req.nextUrl;

  // Admins may inspect a collaborator's tasks via ?owner=<id>; employees are
  // always scoped to their own tasks regardless of the param.
  const ownerParam = searchParams.get("owner");
  const ownerId =
    esAdmin(session.user?.rol) && ownerParam
      ? Number(ownerParam)
      : sessionUserId;

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
  const sessionUserId = session.user?.userId as number;

  const body = await req.json();
  const parsed = createTareaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Admins may assign the task to a collaborator (data.ownerId); employees
  // always create for themselves.
  const ownerId =
    esAdmin(session.user?.rol) && data.ownerId ? data.ownerId : sessionUserId;

  // The chosen lista must belong to the owner OR be shared (accessible to all).
  const lista = await prisma.listaTarea.findFirst({
    where: {
      id: data.listaId,
      OR: [{ ownerId }, { esCompartida: true }],
    },
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
      // Color always inherited from the list
      color: lista.colorDefault ?? null,
      completada: false,
    },
    include: { lista: true },
  });

  return NextResponse.json(mapToITarea(created), { status: 201 });
}
