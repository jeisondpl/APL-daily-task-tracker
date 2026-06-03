export interface ITareaPendiente {
    id: number;
    nombre: string;
    descripcion?: string | null;
    color: string;
    creadoPorId: number;
    creadoPorNombre?: string;
    asignadoAId?: number | null;
    asignadoANombre?: string | null;
    reclamada: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateTareaPendienteDTO {
    nombre: string;
    descripcion?: string;
    color?: string;
    asignadoAId?: number | null;
}

export type IUpdateTareaPendienteDTO = Partial<ICreateTareaPendienteDTO>;

export interface IReclamarTareaPendienteDTO {
    listaId: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
}
