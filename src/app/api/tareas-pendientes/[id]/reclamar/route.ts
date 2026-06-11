import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
import {
    fechaBloqueadaParaRegistro,
    ERROR_DIA_BLOQUEADO,
} from "@/shared/lib/registro-guards";
import { reclamarTareaPendienteSchema } from "@/shared/validation/tarea-pendiente.schema";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/tareas-pendientes/[id]/reclamar
// Employee claims a pending task: creates a real Tarea from it.
export async function POST(req: NextRequest, { params }: RouteContext) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const userId = session.user?.userId as number;
    const { id } = await params;

    const pendiente = await prisma.tareaPendiente.findUnique({
        where: { id: Number(id) },
    });

    if (!pendiente) {
        return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    if (pendiente.reclamada) {
        return NextResponse.json({ error: "Ya fue reclamada" }, { status: 409 });
    }
    // Must be assigned to this user or be pool (null)
    if (pendiente.asignadoAId !== null && pendiente.asignadoAId !== userId) {
        return NextResponse.json({ error: "No asignada a vos" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = reclamarTareaPendienteSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Datos inválidos", issues: parsed.error.issues },
            { status: 400 },
        );
    }

    const { fecha, horaInicio, horaFin } = parsed.data;

    if (fechaBloqueadaParaRegistro(fecha, session.user?.rol)) {
        return NextResponse.json({ error: ERROR_DIA_BLOQUEADO }, { status: 403 });
    }

    // Use the listaId assigned by admin in the pending task
    const listaId = pendiente.listaId;
    if (listaId === null) {
        return NextResponse.json(
            { error: "La tarea pendiente no tiene una lista asignada" },
            { status: 400 },
        );
    }

    // Create real task linked to pendiente + mark pending as claimed
    const [tarea] = await prisma.$transaction([
        prisma.tarea.create({
            data: {
                listaId,
                ownerId: userId,
                fecha: new Date(fecha),
                nombre: pendiente.nombre,
                descripcion: pendiente.descripcion,
                horaInicio,
                horaFin,
                color: pendiente.color,
                origenPendienteId: pendiente.id,
            },
        }),
        prisma.tareaPendiente.update({
            where: { id: pendiente.id },
            data: { reclamada: true },
        }),
    ]);

    return NextResponse.json({ ok: true, tareaId: tarea.id }, { status: 201 });
}
