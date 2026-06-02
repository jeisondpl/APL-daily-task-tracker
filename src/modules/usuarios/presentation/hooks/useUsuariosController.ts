"use client";

import { useState } from "react";
import axios from "axios";
import {
  listUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  listRoles,
} from "@/modules/usuarios/application/useCases/usuarioUseCases";
import type {
  IUsuario,
  IRol,
  ICreateUsuarioDTO,
  IUpdateUsuarioDTO,
} from "@/modules/usuarios/domain/entities/Usuario.entities";

function msg(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    return (e.response?.data as { error?: string })?.error ?? fallback;
  }
  return e instanceof Error ? e.message : fallback;
}

export function useUsuariosController() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [roles, setRoles] = useState<IRol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function _list() {
    setLoading(true);
    setError(null);
    try {
      setUsuarios(await listUsuarios());
    } catch (e) {
      setError(msg(e, "Error al cargar usuarios"));
    } finally {
      setLoading(false);
    }
  }

  async function _listRoles() {
    try {
      setRoles(await listRoles());
    } catch (e) {
      setError(msg(e, "Error al cargar roles"));
    }
  }

  async function _create(dto: ICreateUsuarioDTO) {
    await createUsuario(dto);
    await _list();
  }

  async function _update(id: number, dto: IUpdateUsuarioDTO) {
    await updateUsuario(id, dto);
    await _list();
  }

  async function _delete(id: number) {
    try {
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError(msg(e, "Error al eliminar usuario"));
    }
  }

  return {
    usuarios,
    roles,
    loading,
    error,
    _list,
    _listRoles,
    _create,
    _update,
    _delete,
  };
}
