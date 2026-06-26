export interface EventoLog {
  id: number;
  tipoEvento: string;
  modulo: string;
  accion: string;
  entidad: string;
  idRegistro: number;
  uid: string;
  descripcion: string;
  datosJson: string;
  estado: string;
  creadoEn: string; // ISO datetime
}
