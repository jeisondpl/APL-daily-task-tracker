import { apiListasRepository } from "@/modules/listas-tareas/infrastructure/apiListasRepository";
import type {
  ICreateListaDTO,
  IUpdateListaDTO,
} from "@/modules/listas-tareas/domain/entities/ListaTarea.entities";

export const listListas = () => apiListasRepository.list();

export const getListaById = (id: number) => apiListasRepository.getById(id);

export const createLista = (dto: ICreateListaDTO) =>
  apiListasRepository.create(dto);

export const updateLista = (id: number, dto: IUpdateListaDTO) =>
  apiListasRepository.update(id, dto);

export const deleteLista = (id: number) => apiListasRepository.remove(id);
