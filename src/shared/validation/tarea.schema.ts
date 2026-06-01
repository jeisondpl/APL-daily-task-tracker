import { z } from "zod";

// Slots de 30 min entre 08:00 y 18:00 (24h)
const HORA = /^(0[8-9]|1[0-8]):(00|30)$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

export const createTareaSchema = z
  .object({
    listaId: z.coerce.number().int().positive(),
    fecha: z.string().regex(FECHA, "fecha inválida (YYYY-MM-DD)"),
    nombre: z.string().min(1, "requerido").max(300),
    descripcion: z.string().max(2000).optional(),
    horaInicio: z.string().regex(HORA, "slot inválido (08:00–18:00, :00 o :30)"),
    horaFin: z.string().regex(HORA, "slot inválido (08:00–18:00, :00 o :30)"),
    color: z.string().max(20).optional(),
  })
  .refine((d) => d.horaFin > d.horaInicio, {
    message: "hora fin debe ser mayor a hora inicio",
    path: ["horaFin"],
  });

export const updateTareaSchema = z
  .object({
    listaId: z.coerce.number().int().positive().optional(),
    fecha: z.string().regex(FECHA).optional(),
    nombre: z.string().min(1).max(300).optional(),
    descripcion: z.string().max(2000).optional(),
    horaInicio: z.string().regex(HORA).optional(),
    horaFin: z.string().regex(HORA).optional(),
    color: z.string().max(20).optional(),
    completada: z.boolean().optional(),
  })
  .refine((d) => !d.horaInicio || !d.horaFin || d.horaFin > d.horaInicio, {
    message: "hora fin debe ser mayor a hora inicio",
    path: ["horaFin"],
  });

export type CreateTareaInput = z.infer<typeof createTareaSchema>;
export type UpdateTareaInput = z.infer<typeof updateTareaSchema>;
