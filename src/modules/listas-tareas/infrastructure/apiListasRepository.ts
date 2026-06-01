import { api } from "@/shared/lib/axios";
import type {
  IListaTarea,
  ICreateListaDTO,
  IUpdateListaDTO,
} from "@/modules/listas-tareas/domain/entities/ListaTarea.entities";

async function list(): Promise<IListaTarea[]> {
  const { data } = await api.get<IListaTarea[]>("/listas-tareas");
  return data;
}

async function getById(id: number): Promise<IListaTarea> {
  const { data } = await api.get<IListaTarea>(`/listas-tareas/${id}`);
  return data;
}

async function create(dto: ICreateListaDTO): Promise<IListaTarea> {
  const { data } = await api.post<IListaTarea>("/listas-tareas", dto);
  return data;
}

async function update(id: number, dto: IUpdateListaDTO): Promise<IListaTarea> {
  const { data } = await api.put<IListaTarea>(`/listas-tareas/${id}`, dto);
  return data;
}

async function remove(id: number): Promise<void> {
  await api.delete(`/listas-tareas/${id}`);
}

export const apiListasRepository = {
  list,
  getById,
  create,
  update,
  remove,
};
