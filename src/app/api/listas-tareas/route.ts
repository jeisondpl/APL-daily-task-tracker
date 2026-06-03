import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { esAdmin } from "@/shared/lib/auth-guards";
import { prisma } from "@/shared/lib/prisma";
import { createListaSchema } from "@/shared/validation/lista.schema";
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

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const sessionUserId = session.user?.userId as number;

  // Admins may read a specific owner's lists via ?owner=<id>;
  // otherwise return own lists + all shared lists from other users.
  const ownerParam = req.nextUrl.searchParams.get("owner");

  let rows: ListaWithCountAndOwner[];

  if (esAdmin(session.user?.rol) && ownerParam) {
    rows = await prisma.listaTarea.findMany({
      where: { ownerId: Number(ownerParam) },
      include: { _count: { select: { tareas: true } }, owner: { select: { nombre: true } } },
      orderBy: { nombre: "asc" },
    });
  } else {
    rows = await prisma.listaTarea.findMany({
      where: {
        OR: [
          { ownerId: sessionUserId },
          { esCompartida: true },
        ],
      },
      include: { _count: { select: { tareas: true } }, owner: { select: { nombre: true } } },
      orderBy: { nombre: "asc" },
    });
  }

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
      esCompartida: data.esCompartida ?? false,
    },
    include: { _count: { select: { tareas: true } }, owner: { select: { nombre: true } } },
  });

  return NextResponse.json(mapToIListaTarea(created), { status: 201 });
}
