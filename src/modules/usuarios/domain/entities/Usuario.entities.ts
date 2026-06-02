export interface IRol {
  id: number;
  nombre: string;
}

export interface IUsuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
  rolId: number;
  rolNombre?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateUsuarioDTO {
  nombre: string;
  email: string;
  password: string;
  rolId: number;
  activo?: boolean;
}

export interface IUpdateUsuarioDTO {
  nombre?: string;
  email?: string;
  password?: string; // only re-hashed when a non-empty value is sent
  rolId?: number;
  activo?: boolean;
}
