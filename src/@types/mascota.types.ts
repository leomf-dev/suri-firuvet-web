export interface TipoMascota {
  id: number;
  nombre: string;
}

export interface Mascota {
  id: number;
  nombMas: string;
  idTipoMascota: number;
  nombreTipo: string;
  idCliente: number;
  apodos?: string;
  alergias?: string;
}

export interface MascotaFormData {
  nombMas: string;
  idTipoMascota: number;
  idCliente: number;
  apodos?: string;
  alergias?: string;
}
