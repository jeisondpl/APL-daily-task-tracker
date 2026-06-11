import { api } from "@/shared/lib/axios";
import type { IResumenPuntuacion } from "@/modules/puntuacion/domain/entities/Puntuacion.entities";

export interface PuntuacionMesParams {
  usuarioId?: number; // admin-only; employees get their own score
  mes: number; // 1-12
  anio: number;
}

export const apiPuntuacionRepository = {
  async getResumenMes(params: PuntuacionMesParams): Promise<IResumenPuntuacion> {
    const { data } = await api.get<IResumenPuntuacion>("/puntuacion", {
      params,
    });
    return data;
  },
};
