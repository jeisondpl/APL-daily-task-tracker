// Colombian public holidays per Ley 51 de 1983 (Ley Emiliani), computed
// algorithmically so no yearly list maintenance is needed.

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Butcher's algorithm: Gregorian Easter Sunday for a given year (UTC).
function domingoPascua(anio: number): Date {
  const a = anio % 19;
  const b = Math.floor(anio / 100);
  const c = anio % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(anio, mes - 1, dia));
}

function sumarDias(d: Date, dias: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + dias);
  return r;
}

// Ley Emiliani: when the holiday doesn't fall on Monday, it is observed the
// following Monday.
function siguienteLunes(d: Date): Date {
  const dow = d.getUTCDay();
  return dow === 1 ? d : sumarDias(d, (8 - dow) % 7);
}

// Fixed-date holidays, observed on their actual date.
const FIJOS: Array<[number, number]> = [
  [1, 1], // Año Nuevo
  [5, 1], // Día del Trabajo
  [7, 20], // Independencia
  [8, 7], // Batalla de Boyacá
  [12, 8], // Inmaculada Concepción
  [12, 25], // Navidad
];

// Fixed-date holidays moved to the next Monday.
const TRASLADABLES: Array<[number, number]> = [
  [1, 6], // Reyes Magos
  [3, 19], // San José
  [6, 29], // San Pedro y San Pablo
  [8, 15], // Asunción de la Virgen
  [10, 12], // Día de la Raza
  [11, 1], // Todos los Santos
  [11, 11], // Independencia de Cartagena
];

/** All Colombian holidays of a year as a Set of "YYYY-MM-DD". */
export function festivosColombia(anio: number): Set<string> {
  const festivos = new Set<string>();

  for (const [mes, dia] of FIJOS) {
    festivos.add(toISO(new Date(Date.UTC(anio, mes - 1, dia))));
  }
  for (const [mes, dia] of TRASLADABLES) {
    festivos.add(toISO(siguienteLunes(new Date(Date.UTC(anio, mes - 1, dia)))));
  }

  const pascua = domingoPascua(anio);
  festivos.add(toISO(sumarDias(pascua, -3))); // Jueves Santo
  festivos.add(toISO(sumarDias(pascua, -2))); // Viernes Santo
  festivos.add(toISO(siguienteLunes(sumarDias(pascua, 39)))); // Ascensión
  festivos.add(toISO(siguienteLunes(sumarDias(pascua, 60)))); // Corpus Christi
  festivos.add(toISO(siguienteLunes(sumarDias(pascua, 68)))); // Sagrado Corazón

  return festivos;
}

/** Holidays for every year in the inclusive [desde, hasta] ISO-date range. */
export function festivosEnRango(desde: string, hasta: string): Set<string> {
  const festivos = new Set<string>();
  const anioDesde = Number(desde.slice(0, 4));
  const anioHasta = Number(hasta.slice(0, 4));
  for (let anio = anioDesde; anio <= anioHasta; anio++) {
    for (const f of festivosColombia(anio)) festivos.add(f);
  }
  return festivos;
}
