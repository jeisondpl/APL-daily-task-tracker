import { PENALTY_POINTS, SCORING_TIMEZONE } from "./puntuacion.constants";
import { festivosEnRango } from "./festivosColombia";
import type { IPenalizacionDia } from "./entities/Puntuacion.entities";

// All dates in this module are plain "YYYY-MM-DD" strings, so comparisons
// work lexicographically and the math stays timezone-free (UTC anchored).

function toUTCDate(iso: string): Date {
  return new Date(iso + "T00:00:00.000Z");
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday..Friday only — weekends are never penalized. */
export function esDiaHabil(iso: string): boolean {
  const dow = toUTCDate(iso).getUTCDay();
  return dow >= 1 && dow <= 5;
}

export function shiftISODate(iso: string, deltaDays: number): string {
  const d = toUTCDate(iso);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return toISO(d);
}

/** Calendar date of `date` as seen in the scoring timezone. */
export function dateInScoringTZ(date: Date): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SCORING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function todayInScoringTZ(): string {
  return dateInScoringTZ(new Date());
}

export function maxISO(...dates: string[]): string {
  return dates.reduce((a, b) => (a > b ? a : b));
}

export function minISO(...dates: string[]): string {
  return dates.reduce((a, b) => (a < b ? a : b));
}

/**
 * Pure penalty calculation over an inclusive [desde, hasta] window.
 * Weekends and Colombian public holidays are never penalized.
 * The caller is responsible for clamping the window (scoring start date,
 * user creation date, yesterday) and for role/active exclusions.
 */
export function calcularPenalizaciones(params: {
  desde: string;
  hasta: string;
  fechasConTarea: Set<string>;
}): IPenalizacionDia[] {
  const { desde, hasta, fechasConTarea } = params;
  const penalizaciones: IPenalizacionDia[] = [];
  if (desde > hasta) return penalizaciones;

  const festivos = festivosEnRango(desde, hasta);
  const cursor = toUTCDate(desde);
  const fin = toUTCDate(hasta);
  while (cursor <= fin) {
    const iso = toISO(cursor);
    if (esDiaHabil(iso) && !festivos.has(iso) && !fechasConTarea.has(iso)) {
      penalizaciones.push({
        fecha: iso,
        puntos: PENALTY_POINTS,
        motivo: "Sin tareas registradas",
      });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return penalizaciones;
}
