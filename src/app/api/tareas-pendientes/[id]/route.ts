import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { esAdmin } from "@/shared/lib/auth-guards";
import { prisma } from "@/shared/lib/prisma";
import { updateTareaPendienteSchema } from "@/shared/validation/tarea-pendiente.schema";

type RouteContext = { params: Promise<{ id: string }> };

// PUT: Admin only
export async function PUT(req: NextRequest, { params }: RouteContext) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (!esAdmin(session.user?.rol)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const parsed = updateTareaPendienteSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    const updated = await prisma.tareaPendiente.update({
        where: { id: Number(id) },
        data: {
            ...(data.nombre !== undefined && { nombre: data.nombre }),
            ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
            ...(data.color !== undefined && { color: data.color }),
            ...(data.asignadoAId !== undefined && { asignadoAId: data.asignadoAId }),
            ...(data.fechaInicio !== undefined && { fechaInicio: new Date(data.fechaInicio) }),
            ...(data.fechaFin !== undefined && { fechaFin: new Date(data.fechaFin) }),
        },
        include: {
            creadoPor: { select: { nombre: true } },
            asignadoA: { select: { nombre: true } },
        },
    });

    return NextResponse.json({
        id: updated.id,
        nombre: updated.nombre,
        descripcion: updated.descripcion,
        color: updated.color,
        creadoPorId: updated.creadoPorId,
        creadoPorNombre: updated.creadoPor?.nombre,
        asignadoAId: updated.asignadoAId,
        asignadoANombre: updated.asignadoA?.nombre ?? null,
        reclamada: updated.reclamada,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
    });
}

// DELETE: Admin only
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    if (!esAdmin(session.user?.rol)) return NextResponse.json({ error: "Solo admin" }, { status: 403 });

    const { id } = await params;
    await prisma.tareaPendiente.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
}
