import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { esAdmin } from "@/shared/lib/auth-guards";
import { prisma } from "@/shared/lib/prisma";
import { puntuacionQuerySchema } from "@/shared/validation/puntuacion.schema";
import {
  calcularPenalizaciones,
  dateInScoringTZ,
  maxISO,
  minISO,
  shiftISODate,
  todayInScoringTZ,
} from "@/modules/puntuacion/domain/calcularPenalizaciones";
import {
  ROLES_PENALIZABLES,
  SCORING_START_DATE,
} from "@/modules/puntuacion/domain/puntuacion.constants";
import type { IResumenPuntuacion } from "@/modules/puntuacion/domain/entities/Puntuacion.entities";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const sessionUserId = session.user?.userId as number;

  const parsed = puntuacionQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { usuarioId: usuarioIdParam, mes, anio } = parsed.data;

  // Admins may inspect a collaborator via ?usuarioId=<id>; employees are
  // always scoped to their own score regardless of the param.
  const usuarioId =
    esAdmin(session.user?.rol) && usuarioIdParam
      ? usuarioIdParam
      : sessionUserId;

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: { rol: true },
  });
  if (!usuario) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  const vacio: IResumenPuntuacion = {
    usuarioId,
    totalPuntos: 0,
    diasPenalizados: 0,
    penalizaciones: [],
  };

  // Administrators and inactive users are never penalized.
  if (!usuario.activo || !ROLES_PENALIZABLES.includes(usuario.rol.nombre)) {
    return NextResponse.json(vacio);
  }

  const mm = String(mes).padStart(2, "0");
  const inicioMes = `${anio}-${mm}-01`;
  // Date.UTC(anio, mes, 0) = last day of the requested month.
  const finMes = new Date(Date.UTC(anio, mes, 0)).toISOString().slice(0, 10);

  // Window: never before scoring started nor before the user existed, and
  // only up to yesterday — today is still open for registering tasks.
  const ayer = shiftISODate(todayInScoringTZ(), -1);
  const desde = maxISO(inicioMes, SCORING_START_DATE, dateInScoringTZ(usuario.createdAt));
  const hasta = minISO(finMes, ayer);

  if (desde > hasta) {
    return NextResponse.json(vacio);
  }

  // One range query over the [ownerId, fecha] index; one row per distinct day.
  const rows = await prisma.tarea.findMany({
    where: {
      ownerId: usuarioId,
      fecha: {
        gte: new Date(desde + "T00:00:00.000Z"),
        lte: new Date(hasta + "T23:59:59.999Z"),
      },
    },
    select: { fecha: true },
    distinct: ["fecha"],
  });
  const fechasConTarea = new Set(
    rows.map((r) => r.fecha.toISOString().slice(0, 10)),
  );

  const penalizaciones = calcularPenalizaciones({
    desde,
    hasta,
    fechasConTarea,
  });

  const resumen: IResumenPuntuacion = {
    usuarioId,
    totalPuntos: penalizaciones.reduce((acc, p) => acc + p.puntos, 0),
    diasPenalizados: penalizaciones.length,
    penalizaciones,
  };
  return NextResponse.json(resumen);
}
