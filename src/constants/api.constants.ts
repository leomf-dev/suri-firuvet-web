// ─── REST Endpoints ──────────────────────────────────────────
export const API = {
  CLIENTES: "/api/clientes",
  CLIENTE_BY_ID: (id: number) => `/api/clientes/${id}`,
  CLIENTE_ROL: (id: number) => `/api/clientes/${id}/rol`,
  MASCOTAS: "/api/mascotas",
  MASCOTA_BY_ID: (id: number) => `/api/mascotas/${id}`,
  MASCOTA_DELETE: (id: number, idCliente: number) => `/api/mascotas/${id}?idCliente=${idCliente}`,
  CITAS: "/api/citas",
  CITA_BY_ID: (id: number) => `/api/citas/${id}`,
  CITA_DELETE: (id: number, idCliente: number) => `/api/citas/${id}?idCliente=${idCliente}`,
  TIPOS_CITA: "/api/tipos-cita",
  TIPOS_MASCOTA: "/api/tipos-mascota",
  CLINICAS: "/api/clinicas",
  LOGS: "/api/logs",
} as const;

// ─── SOAP Endpoints ──────────────────────────────────────────
export const SOAP = {
  CATALOGOS: "/soap/catalogos",
  MASCOTAS: "/soap/mascotas",
} as const;

// ─── SOAP Operations ─────────────────────────────────────────
export const SOAP_OPS = {
  OBTENER_TIPOS_MASCOTA: "ObtenerTiposMascota",
  OBTENER_TIPOS_CITA: "ObtenerTiposCita",
  OBTENER_CLINICAS: "ObtenerClinicas",
  REGISTRAR_MASCOTA: "RegistrarMascota",
} as const;
