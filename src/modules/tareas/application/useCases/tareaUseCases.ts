import { apiTareasRepository } from "@/modules/tareas/infrastructure/apiTareasRepository";
import type {
  ICreateTareaDTO,
  IUpdateTareaDTO,
  ITareaFilters,
} from "@/modules/tareas/domain/entities/Tarea.entities";

export const listTareas = (filters?: ITareaFilters) =>
  apiTareasRepository.list(filters);

export const getTareaById = (id: number) =>
  apiTareasRepository.getById(id);

export const createTarea = (dto: ICreateTareaDTO) =>
  apiTareasRepository.create(dto);

export const updateTarea = (id: number, dto: IUpdateTareaDTO) =>
  apiTareasRepository.update(id, dto);

export const deleteTarea = (id: number) =>
  apiTareasRepository.remove(id);

export const toggleTarea = (id: number, completada: boolean) =>
  apiTareasRepository.toggleCompletada(id, completada);
