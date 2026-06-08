import { z } from "zod";

const baseTareaPendienteSchema = z.object({
    nombre: z.string().min(1, "requerido").max(300),
    descripcion: z.string().max(2000).optional(),
    color: z.string().max(20).optional(),
    asignadoAId: z.coerce.number().int().positive().optional().nullable(),
    listaId: z.coerce.number().int().positive().optional(),
    fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "fecha inicio requerida"),
    fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "fecha fin requerida"),
});

export const createTareaPendienteSchema = baseTareaPendienteSchema.refine((d) => d.fechaFin >= d.fechaInicio, {
    message: "La fecha fin no puede ser anterior a la fecha inicio",
    path: ["fechaFin"],
});

export const updateTareaPendienteSchema = baseTareaPendienteSchema.partial();

export const reclamarTareaPendienteSchema = z
    .object({
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
