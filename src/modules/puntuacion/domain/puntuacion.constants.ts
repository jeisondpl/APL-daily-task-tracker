// Points subtracted per business day without any registered task.
export const PENALTY_POINTS = -10;

// Scoring starts on this date; earlier days are never penalized.
export const SCORING_START_DATE = "2026-06-03";

// Day boundaries ("today"/"yesterday") are resolved in this zone, never in
// server UTC — Vercel runs in UTC, which is already "tomorrow" for Colombia
// in the evening.
export const SCORING_TIMEZONE = "America/Bogota";

// Penalties apply only to these roles; Administrador is exempt.
export const ROLES_PENALIZABLES = ["Empleado", "Semillero"];
