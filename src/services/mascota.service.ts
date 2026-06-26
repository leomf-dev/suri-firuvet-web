import { http } from "@api/http";
import { soapCall } from "@api/soap";
import { API, SOAP, SOAP_OPS } from "@constants/index";
import type { Mascota, MascotaFormData } from "@appTypes";

export interface UpdateMascotaDTO {
  nombMas: string;
  idTipoMascota: number;
  idCliente: number;
  apodos?: string;
  alergias?: string;
}

export const mascotaService = {
  // REST
  getAll: () =>
    http.get<Mascota[]>(API.MASCOTAS),

  getByCliente: (idCliente: number) =>
    http.get<Mascota[]>(API.MASCOTAS, { idCliente: String(idCliente) }),

  getById: (id: number) =>
    http.get<Mascota>(API.MASCOTA_BY_ID(id)),

  update: (id: number, data: UpdateMascotaDTO) =>
    http.put<Mascota>(API.MASCOTA_BY_ID(id), data),

  delete: (id: number, idCliente: number) =>
    http.delete<void>(API.MASCOTA_DELETE(id, idCliente)),

  // SOAP — registro de nueva mascota
  registrar: (data: MascotaFormData) =>
    soapCall<Mascota | null>(SOAP.MASCOTAS, SOAP_OPS.REGISTRAR_MASCOTA, {
      nombMas: data.nombMas,
      idTipoMascota: data.idTipoMascota,
      idCliente: data.idCliente,
      apodos: data.apodos ?? "",
      alergias: data.alergias ?? "",
    }),
};
