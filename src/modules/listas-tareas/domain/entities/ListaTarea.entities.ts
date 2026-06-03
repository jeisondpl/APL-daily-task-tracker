export interface IListaTarea {
  id: number;
  nombre: string;
  descripcion?: string | null;
  colorDefault: string;
  esCompartida: boolean;
  ownerId: number;
  ownerNombre?: string;
  tareasCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateListaDTO {
  nombre: string;
  descripcion?: string;
  colorDefault?: string;
  esCompartida?: boolean;
}

export type IUpdateListaDTO = Partial<ICreateListaDTO>;
