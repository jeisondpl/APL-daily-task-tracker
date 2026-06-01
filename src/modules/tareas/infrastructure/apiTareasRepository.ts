import { api } from "@/shared/lib/axios";
import type {
  ITarea,
  ICreateTareaDTO,
  IUpdateTareaDTO,
  ITareaFilters,
} from "@/modules/tareas/domain/entities/Tarea.entities";

async function list(filters?: ITareaFilters): Promise<ITarea[]> {
  const { data } = await api.get<ITarea[]>("/tareas", { params: filters });
  return data;
}

async function getById(id: number): Promise<ITarea> {
  const { data } = await api.get<ITarea>(`/tareas/${id}`);
  return data;
}

async function create(dto: ICreateTareaDTO): Promise<ITarea> {
  const { data } = await api.post<ITarea>("/tareas", dto);
  return data;
}

async function update(id: number, dto: IUpdateTareaDTO): Promise<ITarea> {
  const { data } = await api.put<ITarea>(`/tareas/${id}`, dto);
  return data;
}

async function remove(id: number): Promise<void> {
  await api.delete(`/tareas/${id}`);
}

async function toggleCompletada(id: number, completada: boolean): Promise<ITarea> {
  const { data } = await api.put<ITarea>(`/tareas/${id}`, { completada });
  return data;
}

export const apiTareasRepository = {
  list,
  getById,
  create,
  update,
  remove,
  toggleCompletada,
};
