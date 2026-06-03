import { api } from "@/shared/lib/axios";
import type {
    ITareaPendiente,
    ICreateTareaPendienteDTO,
    IUpdateTareaPendienteDTO,
    IReclamarTareaPendienteDTO,
} from "../domain/entities/TareaPendiente.entities";

const BASE = "/tareas-pendientes";

export const apiTareasPendientesRepository = {
    async list(): Promise<ITareaPendiente[]> {
        const { data } = await api.get(BASE);
        return data;
    },

    async create(dto: ICreateTareaPendienteDTO): Promise<ITareaPendiente> {
        const { data } = await api.post(BASE, dto);
        return data;
    },

    async update(id: number, dto: IUpdateTareaPendienteDTO): Promise<ITareaPendiente> {
        const { data } = await api.put(`${BASE}/${id}`, dto);
        return data;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`${BASE}/${id}`);
    },

    async reclamar(id: number, dto: IReclamarTareaPendienteDTO): Promise<{ tareaId: number }> {
        const { data } = await api.post(`${BASE}/${id}/reclamar`, dto);
        return data;
    },
};
