"use client";

import { useState } from "react";
import axios from "axios";
import { getResumenPuntuacionMes } from "@/modules/puntuacion/application/useCases/puntuacionUseCases";
import type { PuntuacionMesParams } from "@/modules/puntuacion/infrastructure/apiPuntuacionRepository";
import type { IResumenPuntuacion } from "@/modules/puntuacion/domain/entities/Puntuacion.entities";

function msg(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    return (e.response?.data as { error?: string })?.error ?? fallback;
  }
  return e instanceof Error ? e.message : fallback;
}

export function usePuntuacionController() {
  const [resumen, setResumen] = useState<IResumenPuntuacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function _load(params: PuntuacionMesParams) {
    setLoading(true);
    setError(null);
    try {
      setResumen(await getResumenPuntuacionMes(params));
    } catch (e) {
      setError(msg(e, "Error al cargar la puntuación"));
      setResumen(null);
    } finally {
      setLoading(false);
    }
  }

  return { resumen, loading, error, _load };
}
