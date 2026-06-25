import type { Cliente, Mascota, Clinica, TipoCita, TipoMascota, Cita, EventoLog } from "@appTypes/models";

export const clientes: Cliente[] = [
  { id: 1, uid: "ABC123", nombcli: "Sofía", apecli: "Ramírez", fecnac: "1995-07-15" },
  { id: 2, uid: "DEF456", nombcli: "Miguel", apecli: "Pérez", fecnac: "1988-03-22" },
  { id: 3, uid: "GHI789", nombcli: "Marina", apecli: "González", fecnac: "2001-11-03" },
];

export const tipoMascotas: TipoMascota[] = [
  { id: 1, nombre: "Perro" },
  { id: 2, nombre: "Gato" },
  { id: 3, nombre: "Ave" },
  { id: 4, nombre: "Roedor" },
];

export const tipoCitas: TipoCita[] = [
  { id: 1, nombre: "Consulta general" },
  { id: 2, nombre: "Vacunación" },
  { id: 3, nombre: "Desparasitación" },
  { id: 4, nombre: "Emergencia" },
];

export const clinicas: Clinica[] = [
  { id: 1, nombre: "Clínica Luna", direccion: "Av. Libertador 1450, Caracas" },
  { id: 2, nombre: "VetCare", direccion: "Calle Bolívar 121, Maracaibo" },
  { id: 3, nombre: "Animal Health", direccion: "Calle 23, Valencia" },
  { id: 4, nombre: "PetSalud", direccion: "Av. Principal 88, Barquisimeto" },
  { id: 5, nombre: "Clínica Patitas", direccion: "Calle Sucre 45, Mérida" },
  { id: 6, nombre: "VetPlus", direccion: "Urb. El Rosal, Caracas" },
  { id: 7, nombre: "Centro Veterinario Sur", direccion: "Av. Andrés Bello 300, Valencia" },
  { id: 8, nombre: "Clínica MascotaFeliz", direccion: "Calle 10, Maracay" },
  { id: 9, nombre: "AnimalCare 24h", direccion: "Av. Las Delicias, Maracaibo" },
];

export const mascotas: Mascota[] = [
  { id: 1, nombmas: "Kira", tipomas: 1, idcliente: 1, apodos: "Kiki", alergias: "Ninguna" },
  { id: 2, nombmas: "Milo", tipomas: 2, idcliente: 2, apodos: "Milito", alergias: "Polvo" },
  { id: 3, nombmas: "Luna", tipomas: 1, idcliente: 3, apodos: "Lunita", alergias: "Girasol" },
];

export const citas: Cita[] = [
  { idcita: 1, tipocita: 1, fecha: "2026-06-02T10:00:00Z", comentario: "Control general y vacunación", idmascota: 1, idcliente: 1, idclinica: 1 },
  { idcita: 2, tipocita: 2, fecha: "2026-06-12T09:00:00Z", comentario: "Vacuna anual y revisión dental", idmascota: 2, idcliente: 2, idclinica: 2 },
  { idcita: 3, tipocita: 3, fecha: "2026-05-05T15:00:00Z", comentario: "Desparasitación y revisión de piel", idmascota: 3, idcliente: 3, idclinica: 3 },
];

export const eventoLog: EventoLog[] = [
  {
    id: 1,
    tipo_evento: "CREACIÓN",
    modulo: "Citas",
    accion: "Registrar",
    entidad: "cita",
    id_registro: 1,
    uid: "ABC123",
    descripcion: "Se creó la cita para Kira",
    datos_json: JSON.stringify({ fecha: "2026-06-02T10:00:00Z", tipocita: 1 }),
    estado: "Activo",
    creado_en: "2026-05-20T08:34:00Z",
  },
  {
    id: 2,
    tipo_evento: "ACTUALIZACIÓN",
    modulo: "Mascotas",
    accion: "Editar",
    entidad: "mascota",
    id_registro: 2,
    uid: "DEF456",
    descripcion: "Se actualizó la alergia de Milo",
    datos_json: JSON.stringify({ alergias: "Polvo" }),
    estado: "Activo",
    creado_en: "2026-05-22T14:12:00Z",
  },
];
