export interface IListaTarea {
  id: number;
  nombre: string;
  descripcion?: string | null;
  colorDefault: string;
  ownerId: number;
  tareasCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateListaDTO {
  nombre: string;
  descripcion?: string;
  colorDefault?: string;
}

export type IUpdateListaDTO = Partial<ICreateListaDTO>;
