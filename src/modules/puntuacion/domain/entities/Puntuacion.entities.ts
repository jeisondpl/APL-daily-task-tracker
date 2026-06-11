export interface IPenalizacionDia {
  fecha: string; // YYYY-MM-DD
  puntos: number;
  motivo: string;
}

export interface IResumenPuntuacion {
  usuarioId: number;
  totalPuntos: number;
  diasPenalizados: number;
  penalizaciones: IPenalizacionDia[];
}
