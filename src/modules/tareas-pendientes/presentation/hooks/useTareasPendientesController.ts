"use client";

import { useState, useCallback } from "react";
import { apiTareasPendientesRepository as repo } from "../../infrastructure/apiTareasPendientesRepository";
import type {
    ITareaPendiente,
    ICreateTareaPendienteDTO,
    IUpdateTareaPendienteDTO,
    IReclamarTareaPendienteDTO,
} from "../../domain/entities/TareaPendiente.entities";

export function useTareasPendientesController() {
    const [pendientes, setPendientes] = useState<ITareaPendiente[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const _list = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await repo.list();
            setPendientes(data);
        } catch (e: unknown) {
            const err = e as Record<string, unknown>
            const msg = (err?.response as Record<string, unknown>)?.data as Record<string, unknown>
            setError((msg?.error as string) ?? (err?.message as string) ?? 'Error');
        } finally {
            setLoading(false);
        }
    }, []);

    const _create = useCallback(async (dto: ICreateTareaPendienteDTO) => {
        const created = await repo.create(dto);
        setPendientes((prev) => [created, ...prev]);
    }, []);

    const _update = useCallback(async (id: number, dto: IUpdateTareaPendienteDTO) => {
        const updated = await repo.update(id, dto);
        setPendientes((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }, []);

    const _delete = useCallback(async (id: number) => {
        await repo.remove(id);
        setPendientes((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const _reclamar = useCallback(async (id: number, dto: IReclamarTareaPendienteDTO) => {
        const result = await repo.reclamar(id, dto);
        setPendientes((prev) => prev.filter((p) => p.id !== id));
        return result;
    }, []);

    return { pendientes, loading, error, _list, _create, _update, _delete, _reclamar };
}
