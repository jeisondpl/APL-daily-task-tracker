import { esAdmin } from "./auth-guards";
import { todayInScoringTZ } from "@/modules/puntuacion/domain/calcularPenalizaciones";

export const ERROR_DIA_BLOQUEADO =
  "Los días anteriores están bloqueados: no se pueden registrar ni modificar tareas pasadas";

// Workers may only register/edit tasks for today or future days. Past days
// are locked server-side so penalties can't be dodged by backfilling.
// Admins are exempt. "Today" is resolved in the scoring timezone, matching
// the penalty cutoff.
export function fechaBloqueadaParaRegistro(
  fechaISO: string,
  rol: string | undefined | null,
): boolean {
  if (esAdmin(rol)) return false;
  return fechaISO < todayInScoringTZ();
}
