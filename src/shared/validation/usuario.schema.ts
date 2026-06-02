import { z } from "zod";

export const createUsuarioSchema = z.object({
  nombre: z.string().min(1, "requerido").max(200),
  email: z.string().email("email inválido").max(200),
  password: z.string().min(6, "mínimo 6 caracteres").max(100),
  rolId: z.coerce.number().int().positive("rol requerido"),
  activo: z.boolean().optional(),
});

export const updateUsuarioSchema = z.object({
  nombre: z.string().min(1).max(200).optional(),
  email: z.string().email("email inválido").max(200).optional(),
  // Empty string means "keep current password".
  password: z
    .string()
    .max(100)
    .refine((v) => v === "" || v.length >= 6, "mínimo 6 caracteres")
    .optional(),
  rolId: z.coerce.number().int().positive().optional(),
  activo: z.boolean().optional(),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
