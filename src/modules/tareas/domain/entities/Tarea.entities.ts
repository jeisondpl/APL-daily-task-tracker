export interface ITarea {
  id: number;
  listaId: number;
  listaNombre?: string;
  ownerId: number;
  fecha: string; // ISO YYYY-MM-DD
  nombre: string;
  descripcion?: string | null;
  horaInicio: string; // HH:MM
  horaFin: string; // HH:MM
  color: string;
  completada: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTareaDTO {
  listaId: number;
  fecha: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  color?: string;
  descripcion?: string;
}

export type IUpdateTareaDTO = Partial<ICreateTareaDTO> & {
  completada?: boolean;
};

export interface ITareaFilters {
  fecha?: string;
  desde?: string;
  hasta?: string;
}
