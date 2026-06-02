import { api } from "@/shared/lib/axios";
import type {
  IUsuario,
  IRol,
  ICreateUsuarioDTO,
  IUpdateUsuarioDTO,
} from "@/modules/usuarios/domain/entities/Usuario.entities";

export const apiUsuariosRepository = {
  async list(): Promise<IUsuario[]> {
    const { data } = await api.get<IUsuario[]>("/usuarios");
    return data;
  },
  async getById(id: number): Promise<IUsuario> {
    const { data } = await api.get<IUsuario>(`/usuarios/${id}`);
    return data;
  },
  async create(dto: ICreateUsuarioDTO): Promise<IUsuario> {
    const { data } = await api.post<IUsuario>("/usuarios", dto);
    return data;
  },
  async update(id: number, dto: IUpdateUsuarioDTO): Promise<IUsuario> {
    const { data } = await api.put<IUsuario>(`/usuarios/${id}`, dto);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
  async listRoles(): Promise<IRol[]> {
    const { data } = await api.get<IRol[]>("/roles");
    return data;
  },
};
