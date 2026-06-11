import { z } from "zod";

export const puntuacionQuerySchema = z.object({
  // Admin-only: inspect a collaborator. Ignored for employees.
  usuarioId: z.coerce.number().int().positive().optional(),
  mes: z.coerce.number().int().min(1).max(12),
  anio: z.coerce.number().int().min(2000).max(2100),
});

export type PuntuacionQueryInput = z.infer<typeof puntuacionQuerySchema>;
