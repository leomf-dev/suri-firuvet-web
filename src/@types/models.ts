export interface Cliente {
  id: number;
  uid: string;
  nombcli: string;
  apecli: string;
  fecnac: string;
}

export interface TipoMascota {
  id: number;
  nombre: string;
}

export interface TipoCita {
  id: number;
  nombre: string;
}

export interface Clinica {
  id: number;
  nombre: string;
  direccion: string;
}

export interface Mascota {
  id: number;
  nombmas: string;
  tipomas: number; // relacion con TipoMascota.id
  idcliente: number; // relacion con Cliente.id
  apodos: string;
  alergias: string;
}

export interface Cita {
  idcita: number;
  tipocita: number; // relacion con TipoCita.id
  fecha: string; // timestamp ISO
  comentario: string;
  idmascota: number; // relacion con Mascota.id
  idcliente: number; // relacion con Cliente.id
  idclinica: number; // relacion con Clinica.id
}

export interface EventoLog {
  id: number;
  tipo_evento: string;
  modulo: string;
  accion: string;
  entidad: string;
  id_registro: number;
  uid: string;
  descripcion: string;
  datos_json: string;
  estado: string;
  creado_en: string;
}
