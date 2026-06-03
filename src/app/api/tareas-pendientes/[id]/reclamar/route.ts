import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";
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

    const { listaId, fecha, horaInicio, horaFin } = parsed.data;

    // Verify lista belongs to user
    const lista = await prisma.listaTarea.findUnique({ where: { id: listaId } });
    if (!lista || lista.ownerId !== userId) {
        return NextResponse.json({ error: "Lista no válida" }, { status: 400 });
    }

    // Create real task + mark pending as claimed in a transaction
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
            },
        }),
        prisma.tareaPendiente.update({
            where: { id: pendiente.id },
            data: { reclamada: true },
        }),
    ]);

    return NextResponse.json({ ok: true, tareaId: tarea.id }, { status: 201 });
}
