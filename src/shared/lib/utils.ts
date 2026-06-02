export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

// Local calendar date as YYYY-MM-DD. NOT toISOString() — that returns the UTC
// date, which is the next day for users west of UTC in the evening (e.g.
// Colombia UTC-5 at 19:00 → UTC is already tomorrow). That mismatch made the
// timeline query the wrong day and show no tasks.
export function todayISO(): string {
  return toISODateLocal(new Date());
}

export function toISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Parse a "YYYY-MM-DD" string as a LOCAL date (not UTC midnight), so display
// never shifts a day across time zones.
export function parseLocalDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

// First and last day of a month as local YYYY-MM-DD strings (for range queries).
export function monthRangeISO(month: Date): { desde: string; hasta: string } {
  const y = month.getFullYear();
  const m = month.getMonth();
  return {
    desde: toISODateLocal(new Date(y, m, 1)),
    hasta: toISODateLocal(new Date(y, m + 1, 0)),
  };
}

export function formatFechaLarga(fecha: string | Date): string {
  const d = typeof fecha === "string" ? parseLocalDate(fecha) : fecha;
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function toDateInput(fecha: string | Date): string {
  const d = typeof fecha === "string" ? parseLocalDate(fecha) : fecha;
  return toISODateLocal(d);
}
