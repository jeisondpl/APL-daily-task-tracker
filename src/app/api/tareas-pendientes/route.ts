import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { esAdmin } from "@/shared/lib/auth-guards";
import { prisma } from "@/shared/lib/prisma";
import { createTareaPendienteSchema } from "@/shared/validation/tarea-pendiente.schema";
import type { ITareaPendiente } from "@/modules/tareas-pendientes/domain/entities/TareaPendiente.entities";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): ITareaPendiente {
    return {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion ?? undefined,
        color: row.color,
        creadoPorId: row.creadoPorId,
        creadoPorNombre: row.creadoPor?.nombre ?? undefined,
        asignadoAId: row.asignadoAId ?? null,
        asignadoANombre: row.asignadoA?.nombre ?? null,
        reclamada: row.reclamada,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}

// GET: Admin sees all; employee sees assigned to them or unassigned (pool)
export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const userId = session.user?.userId as number;
    const isAdm = esAdmin(session.user?.rol);

    const where = isAdm
        ? {}
        : {
            reclamada: false,
            OR: [{ asignadoAId: userId }, { asignadoAId: null }],
        };

    const rows = await prisma.tareaPendiente.findMany({
        where,
        include: {
            creadoPor: { select: { nombre: true } },
            asignadoA: { select: { nombre: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rows.map(mapRow));
}

// POST: Only admin can create
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (!esAdmin(session.user?.rol)) {
        return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
    }
    const creadoPorId = session.user?.userId as number;

    const body = await req.json();
    const parsed = createTareaPendienteSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Datos inválidos", issues: parsed.error.issues },
            { status: 400 },
        );
    }

    const data = parsed.data;
    const created = await prisma.tareaPendiente.create({
        data: {
            nombre: data.nombre,
            descripcion: data.descripcion ?? null,
            color: data.color ?? "#10B981",
            creadoPorId,
            asignadoAId: data.asignadoAId ?? null,
        },
        include: {
            creadoPor: { select: { nombre: true } },
            asignadoA: { select: { nombre: true } },
        },
    });

    return NextResponse.json(mapRow(created), { status: 201 });
}
