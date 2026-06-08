export interface ITareaPendiente {
    id: number;
    nombre: string;
    descripcion?: string | null;
    color: string;
    creadoPorId: number;
    creadoPorNombre?: string;
    asignadoAId?: number | null;
    asignadoANombre?: string | null;
    listaId: number;
    listaNombre?: string;
    reclamada: boolean;
    fechaInicio: string;
    fechaFin: string;
    // Calculated fields (admin view)
    horasEsperadas?: number;
    horasEjecutadas?: number;
    avancePct?: number;
    avanceEsperadoHoy?: number; // % expected based on elapsed days
    createdAt: string;
    updatedAt: string;
}

export interface ICreateTareaPendienteDTO {
    nombre: string;
    descripcion?: string;
    color?: string;
    asignadoAId?: number | null;
    listaId?: number;
    fechaInicio: string;
    fechaFin: string;
}

export type IUpdateTareaPendienteDTO = Partial<ICreateTareaPendienteDTO>;

export interface IReclamarTareaPendienteDTO {
    fecha: string;
    horaInicio: string;
    horaFin: string;
}
