"use client";

import { useState } from "react";
import {
  listTareas,
  createTarea,
  updateTarea,
  deleteTarea,
  toggleTarea,
} from "@/modules/tareas/application/useCases/tareaUseCases";
import type {
  ITarea,
  ICreateTareaDTO,
  IUpdateTareaDTO,
  ITareaFilters,
} from "@/modules/tareas/domain/entities/Tarea.entities";

export function useTareasController() {
  const [tareas, setTareas] = useState<ITarea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function _list(filters?: ITareaFilters) {
    setLoading(true);
    setError(null);
    try {
      const result = await listTareas(filters);
      setTareas(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar tareas");
    } finally {
      setLoading(false);
    }
  }

  async function _create(dto: ICreateTareaDTO) {
    setError(null);
    try {
      const created = await createTarea(dto);
      // Optimistically append; caller can re-list if ordering matters
      setTareas((prev) => [...prev, created]);
      return created;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear tarea");
    }
  }

  async function _update(id: number, dto: IUpdateTareaDTO) {
    setError(null);
    try {
      const updated = await updateTarea(id, dto);
      setTareas((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al actualizar tarea");
    }
  }

  async function _delete(id: number) {
    setError(null);
    try {
      await deleteTarea(id);
      setTareas((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar tarea");
    }
  }

  async function _toggle(id: number, completada: boolean) {
    setError(null);
    try {
      const updated = await toggleTarea(id, completada);
      setTareas((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al actualizar tarea");
    }
  }

  return { tareas, loading, error, _list, _create, _update, _delete, _toggle };
}
