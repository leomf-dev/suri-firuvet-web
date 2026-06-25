// Tipos que coinciden con la base de datos

export interface Cliente {
  id: number;
  nombcli: string;
  apecli: string;
  fecnac?: string; // DATE
  uid?: string;
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
  direccion?: string;
}

export interface Mascota {
  id: number;
  nombmas: string;
  tipomas: number;
  idcliente: number;
  apodos?: string;
  alergias?: string;
  // Relaciones populadas
  tipoMascota?: TipoMascota;
  cliente?: Cliente;
}

export interface Cita {
  idcita: number;
  tipocita: number;
  fecha: string; // TIMESTAMP
  comentario?: string;
  idmascota: number;
  idcliente: number;
  idclinica: number;
  // Relaciones populadas
  tipoCita?: TipoCita;
  mascota?: Mascota;
  cliente?: Cliente;
  clinica?: Clinica;
}

// Tipos para formularios
export interface MascotaFormData {
  nombmas: string;
  tipomas: number;
  apodos?: string;
  alergias?: string;
}

export interface CitaFormData {
  tipocita: number;
  fecha: string;
  hora: string; // Se combinará con fecha
  comentario: string;
  idmascota: number;
  idcliente: number;
  idclinica: number;
}

// Datos de referencia (corresponden a los INSERTs)
export const TIPOS_MASCOTA: TipoMascota[] = [
  { id: 1, nombre: 'Perro' },
  { id: 2, nombre: 'Gato' },
  { id: 3, nombre: 'Conejo' },
  { id: 4, nombre: 'Hámster' },
  { id: 5, nombre: 'Ave' }
];

export const TIPOS_CITA: TipoCita[] = [
  { id: 1, nombre: 'Consulta General' },
  { id: 2, nombre: 'Vacunación' },
  { id: 3, nombre: 'Control' },
  { id: 4, nombre: 'Emergencia' }
];

export const CLINICAS: Clinica[] = [
  { id: 1, nombre: 'Firuvet San Miguel', direccion: 'Av. La Marina 2500, San Miguel' },
  { id: 2, nombre: 'Firuvet Miraflores', direccion: 'Calle Schell 310, Miraflores' },
  { id: 3, nombre: 'Firuvet Surco', direccion: 'Av. Caminos del Inca 1200, Surco' },
  { id: 4, nombre: 'Firuvet San Borja', direccion: 'Av. San Luis 1850, San Borja' },
  { id: 5, nombre: 'Firuvet Jesús María', direccion: 'Av. Brasil 1560, Jesús María' }
];

export const CLIENTES: Cliente[] = [
  { id: 1, nombcli: 'Kaled', apecli: 'Noronha', fecnac: '2000-05-15' },
  { id: 2, nombcli: 'María', apecli: 'López', fecnac: '1995-08-22' },
  { id: 3, nombcli: 'Carlos', apecli: 'Ramírez', fecnac: '1988-11-03' }
];

export const MASCOTAS_MOCK: Mascota[] = [
  { 
    id: 1, 
    nombmas: 'Firulais', 
    tipomas: 1, 
    idcliente: 1,
    tipoMascota: TIPOS_MASCOTA.find(t => t.id === 1)!,
    cliente: CLIENTES.find(c => c.id === 1)!
  },
  { 
    id: 2, 
    nombmas: 'Michi', 
    tipomas: 2, 
    idcliente: 1,
    tipoMascota: TIPOS_MASCOTA.find(t => t.id === 2)!,
    cliente: CLIENTES.find(c => c.id === 1)!
  },
  { 
    id: 3, 
    nombmas: 'Luna', 
    tipomas: 1, 
    idcliente: 2,
    tipoMascota: TIPOS_MASCOTA.find(t => t.id === 1)!,
    cliente: CLIENTES.find(c => c.id === 2)!
  },
  { 
    id: 4, 
    nombmas: 'Simba', 
    tipomas: 2, 
    idcliente: 2,
    tipoMascota: TIPOS_MASCOTA.find(t => t.id === 2)!,
    cliente: CLIENTES.find(c => c.id === 2)!
  },
  { 
    id: 5, 
    nombmas: 'Copo', 
    tipomas: 3, 
    idcliente: 2,
    tipoMascota: TIPOS_MASCOTA.find(t => t.id === 3)!,
    cliente: CLIENTES.find(c => c.id === 2)!
  },
  { 
    id: 6, 
    nombmas: 'Rocky', 
    tipomas: 1, 
    idcliente: 3,
    tipoMascota: TIPOS_MASCOTA.find(t => t.id === 1)!,
    cliente: CLIENTES.find(c => c.id === 3)!
  },
  { 
    id: 7, 
    nombmas: 'Pelusa', 
    tipomas: 4, 
    idcliente: 1,
    tipoMascota: TIPOS_MASCOTA.find(t => t.id === 4)!,
    cliente: CLIENTES.find(c => c.id === 1)!
  },
  { 
    id: 8, 
    nombmas: 'Nube', 
    tipomas: 5, 
    idcliente: 2,
    tipoMascota: TIPOS_MASCOTA.find(t => t.id === 5)!,
    cliente: CLIENTES.find(c => c.id === 2)!
  },
  { 
    id: 9, 
    nombmas: 'Thor', 
    tipomas: 1, 
    idcliente: 3,
    tipoMascota: TIPOS_MASCOTA.find(t => t.id === 1)!,
    cliente: CLIENTES.find(c => c.id === 3)!
  }
];

export const CITAS_MOCK: Cita[] = [
  {
    idcita: 1,
    tipocita: 1,
    fecha: '2025-07-10T09:00:00',
    comentario: 'Revisión general de rutina',
    idmascota: 1,
    idcliente: 1,
    idclinica: 1,
    tipoCita: TIPOS_CITA.find(t => t.id === 1)!,
    mascota: MASCOTAS_MOCK.find(m => m.id === 1)!,
    cliente: CLIENTES.find(c => c.id === 1)!,
    clinica: CLINICAS.find(c => c.id === 1)!
  },
  {
    idcita: 2,
    tipocita: 2,
    fecha: '2025-07-12T10:30:00',
    comentario: 'Vacuna antirrábica',
    idmascota: 2,
    idcliente: 1,
    idclinica: 3,
    tipoCita: TIPOS_CITA.find(t => t.id === 2)!,
    mascota: MASCOTAS_MOCK.find(m => m.id === 2)!,
    cliente: CLIENTES.find(c => c.id === 1)!,
    clinica: CLINICAS.find(c => c.id === 3)!
  },
  {
    idcita: 3,
    tipocita: 4,
    fecha: '2025-07-08T15:00:00',
    comentario: 'Vómitos frecuentes desde ayer',
    idmascota: 3,
    idcliente: 2,
    idclinica: 2,
    tipoCita: TIPOS_CITA.find(t => t.id === 4)!,
    mascota: MASCOTAS_MOCK.find(m => m.id === 3)!,
    cliente: CLIENTES.find(c => c.id === 2)!,
    clinica: CLINICAS.find(c => c.id === 2)!
  },
  {
    idcita: 4,
    tipocita: 3,
    fecha: '2025-07-15T11:00:00',
    comentario: 'Control post-operatorio',
    idmascota: 4,
    idcliente: 2,
    idclinica: 5,
    tipoCita: TIPOS_CITA.find(t => t.id === 3)!,
    mascota: MASCOTAS_MOCK.find(m => m.id === 4)!,
    cliente: CLIENTES.find(c => c.id === 2)!,
    clinica: CLINICAS.find(c => c.id === 5)!
  },
  {
    idcita: 5,
    tipocita: 2,
    fecha: '2025-07-20T09:30:00',
    comentario: 'Primera vacuna triple felina',
    idmascota: 5,
    idcliente: 2,
    idclinica: 2,
    tipoCita: TIPOS_CITA.find(t => t.id === 2)!,
    mascota: MASCOTAS_MOCK.find(m => m.id === 5)!,
    cliente: CLIENTES.find(c => c.id === 2)!,
    clinica: CLINICAS.find(c => c.id === 2)!
  },
  {
    idcita: 6,
    tipocita: 1,
    fecha: '2025-07-11T14:00:00',
    comentario: 'Cojea de la pata trasera derecha',
    idmascota: 6,
    idcliente: 3,
    idclinica: 4,
    tipoCita: TIPOS_CITA.find(t => t.id === 1)!,
    mascota: MASCOTAS_MOCK.find(m => m.id === 6)!,
    cliente: CLIENTES.find(c => c.id === 3)!,
    clinica: CLINICAS.find(c => c.id === 4)!
  }
];