import { z } from "zod";

export const createTareaPendienteSchema = z.object({
    nombre: z.string().min(1, "requerido").max(300),
    descripcion: z.string().max(2000).optional(),
    color: z.string().max(20).optional(),
    asignadoAId: z.coerce.number().int().positive().optional().nullable(),
});

export const updateTareaPendienteSchema = createTareaPendienteSchema.partial();

export const reclamarTareaPendienteSchema = z
    .object({
        listaId: z.coerce.number().int().positive(),
        fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "fecha inválida"),
        horaInicio: z
            .string()
            .regex(/^(0[5-9]|1[0-9]|2[0-3]):(00|30)$/, "slot inválido"),
        horaFin: z
            .string()
            .regex(/^(0[5-9]|1[0-9]|2[0-3]):(00|30)$/, "slot inválido"),
    })
    .refine((d) => d.horaFin > d.horaInicio, {
        message: "hora fin debe ser mayor a hora inicio",
        path: ["horaFin"],
    });

export type CreateTareaPendienteInput = z.infer<typeof createTareaPendienteSchema>;
export type ReclamarTareaPendienteInput = z.infer<typeof reclamarTareaPendienteSchema>;
