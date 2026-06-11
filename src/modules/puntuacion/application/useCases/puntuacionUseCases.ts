import {
  apiPuntuacionRepository,
  type PuntuacionMesParams,
} from "@/modules/puntuacion/infrastructure/apiPuntuacionRepository";

export const getResumenPuntuacionMes = (params: PuntuacionMesParams) =>
  apiPuntuacionRepository.getResumenMes(params);
