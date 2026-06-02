"use client";

import { useState } from "react";
import {
  listListas,
  createLista,
  updateLista,
  deleteLista,
} from "@/modules/listas-tareas/application/useCases/listaUseCases";
import type {
  IListaTarea,
  ICreateListaDTO,
  IUpdateListaDTO,
} from "@/modules/listas-tareas/domain/entities/ListaTarea.entities";

export function useListasController() {
  const [listas, setListas] = useState<IListaTarea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function _list(owner?: number) {
    setLoading(true);
    setError(null);
    try {
      const result = await listListas(owner);
      setListas(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar listas");
    } finally {
      setLoading(false);
    }
  }

  async function _create(dto: ICreateListaDTO) {
    setError(null);
    try {
      const created = await createLista(dto);
      setListas((prev) => [...prev, created]);
      return created;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear lista");
    }
  }

  async function _update(id: number, dto: IUpdateListaDTO) {
    setError(null);
    try {
      const updated = await updateLista(id, dto);
      setListas((prev) => prev.map((l) => (l.id === id ? updated : l)));
      return updated;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al actualizar lista");
    }
  }

  async function _delete(id: number) {
    setError(null);
    try {
      await deleteLista(id);
      setListas((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar lista");
    }
  }

  return { listas, loading, error, _list, _create, _update, _delete };
}
