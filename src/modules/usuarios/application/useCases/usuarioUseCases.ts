import { apiUsuariosRepository } from "@/modules/usuarios/infrastructure/apiUsuariosRepository";
import type {
  ICreateUsuarioDTO,
  IUpdateUsuarioDTO,
} from "@/modules/usuarios/domain/entities/Usuario.entities";

export const listUsuarios = () => apiUsuariosRepository.list();
export const createUsuario = (dto: ICreateUsuarioDTO) =>
  apiUsuariosRepository.create(dto);
export const updateUsuario = (id: number, dto: IUpdateUsuarioDTO) =>
  apiUsuariosRepository.update(id, dto);
export const deleteUsuario = (id: number) => apiUsuariosRepository.remove(id);
export const listRoles = () => apiUsuariosRepository.listRoles();
