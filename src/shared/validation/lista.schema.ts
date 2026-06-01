import { z } from "zod";

export const createListaSchema = z.object({
  nombre: z.string().min(1, "requerido").max(200),
  descripcion: z.string().max(2000).optional(),
  colorDefault: z.string().max(20).optional(),
});

export const updateListaSchema = createListaSchema.partial();

export type CreateListaInput = z.infer<typeof createListaSchema>;
export type UpdateListaInput = z.infer<typeof updateListaSchema>;
