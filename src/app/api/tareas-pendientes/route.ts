import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { esAdmin } from "@/shared/lib/auth-guards";
import { prisma } from "@/shared/lib/prisma";
import { createTareaPendienteSchema } from "@/shared/validation/tarea-pendiente.schema";
import type { ITareaPendiente } from "@/modules/tareas-pendientes/domain/entities/TareaPendiente.entities";
import { Prisma } from "@prisma/client";

const JORNADA_HORAS = 8.8;

function toMin(hhmm: string): number {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function diffDays(start: Date, end: Date): number {
    const ms = end.getTime() - start.getTime();
    return Math.floor(ms / 86_400_000) + 1;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any, includeAvance = false): ITareaPendiente {
    const base: ITareaPendiente = {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion ?? undefined,
        color: row.color,
        creadoPorId: row.creadoPorId,
        creadoPorNombre: row.creadoPor?.nombre ?? undefined,
        asignadoAId: row.asignadoAId ?? null,
        asignadoANombre: row.asignadoA?.nombre ?? null,
        listaId: row.listaId,
        listaNombre: row.lista?.nombre ?? undefined,
        reclamada: row.reclamada,
        fechaInicio: row.fechaInicio instanceof Date ? row.fechaInicio.toISOString().slice(0, 10) : row.fechaInicio,
        fechaFin: row.fechaFin instanceof Date ? row.fechaFin.toISOString().slice(0, 10) : row.fechaFin,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };

    if (includeAvance && row.tareasGeneradas) {
        const dias = diffDays(new Date(row.fechaInicio), new Date(row.fechaFin));
        const horasEsperadas = dias * JORNADA_HORAS;
        const horasEjecutadas = (row.tareasGeneradas as { horaInicio: string; horaFin: string }[])
            .reduce((acc: number, t: { horaInicio: string; horaFin: string }) => acc + (toMin(t.horaFin) - toMin(t.horaInicio)) / 60, 0);
        base.horasEsperadas = Math.round(horasEsperadas * 10) / 10;
        base.horasEjecutadas = Math.round(horasEjecutadas * 10) / 10;
        base.avancePct = horasEsperadas > 0 ? Math.min(100, Math.round((horasEjecutadas / horasEsperadas) * 100)) : 0;

        // Expected progress based on days elapsed so far
        const today = new Date();
        const inicio = new Date(row.fechaInicio);
        const fin = new Date(row.fechaFin);
        if (today >= inicio) {
            const diasTranscurridos = Math.min(diffDays(inicio, today), dias);
            base.avanceEsperadoHoy = Math.round((diasTranscurridos / dias) * 100);
        } else {
            base.avanceEsperadoHoy = 0;
        }
    }

    return base;
}

// GET: Admin sees all with avance; employee sees only vigentes assigned/pool
export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const userId = session.user?.userId as number;
    const isAdm = esAdmin(session.user?.rol);
    const today = new Date().toISOString().slice(0, 10);

    if (isAdm) {
        const rows = await prisma.tareaPendiente.findMany({
            include: {
                creadoPor: { select: { nombre: true } },
                asignadoA: { select: { nombre: true } },
                lista: { select: { nombre: true } },
                tareasGeneradas: { select: { horaInicio: true, horaFin: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(rows.map((r) => mapRow(r, true)));
    }

    // Employee: only vigentes and not fully claimed
    const rows = await prisma.tareaPendiente.findMany({
        where: {
            reclamada: false,
            fechaInicio: { lte: new Date(today) },
            fechaFin: { gte: new Date(today) },
            OR: [{ asignadoAId: userId }, { asignadoAId: null }],
        },
        include: {
            creadoPor: { select: { nombre: true } },
            asignadoA: { select: { nombre: true } },
            lista: { select: { nombre: true } },
            tareasGeneradas: { select: { horaInicio: true, horaFin: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rows.map((r) => mapRow(r, true)));
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

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    const parsed = createTareaPendienteSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Datos inválidos", issues: parsed.error.issues },
            { status: 400 },
        );
    }

    const data = parsed.data;
    const debug = process.env.NODE_ENV !== "production";

    try {
        const created = await prisma.tareaPendiente.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion ?? null,
                color: data.color ?? "#10B981",
                creadoPorId,
                asignadoAId: data.asignadoAId ?? null,
                listaId: data.listaId,
                fechaInicio: new Date(data.fechaInicio),
                fechaFin: new Date(data.fechaFin),
            },
            include: {
                creadoPor: { select: { nombre: true } },
                asignadoA: { select: { nombre: true } },
                lista: { select: { nombre: true } },
            },
        });

        return NextResponse.json(mapRow(created), { status: 201 });
    } catch (err: unknown) {
        console.error("POST /api/tareas-pendientes failed", err);

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json(
                {
                    error: "Error de base de datos",
                    ...(debug ? { prisma: { code: err.code, meta: err.meta } } : {}),
                },
                { status: 500 },
            );
        }

        if (err instanceof Prisma.PrismaClientValidationError) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    ...(debug ? { details: err.message } : {}),
                },
                { status: 400 },
            );
        }

        return NextResponse.json(
            {
                error: "Error interno",
                ...(debug && err instanceof Error ? { details: err.message } : {}),
            },
            { status: 500 },
        );
    }
}
