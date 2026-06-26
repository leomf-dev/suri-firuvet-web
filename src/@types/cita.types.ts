export interface TipoCita {
  id: number;
  nombre: string;
}

export interface Cita {
  idCita: number;
  nombreTipoCita: string;
  fecha: string; // ISO 8601
  comentario: string;
  idMascota: number;
  nombreMascota: string;
  idCliente: number;
  nombreCliente: string;
  idClinica: number;
  nombreClinica: string;
}

export interface CitaFormData {
  idTipoCita: number;
  fecha: string; // ISO 8601
  comentario: string;
  idMascota: number;
  idCliente: number;
  idClinica: number;
}
