import { http } from "@api/http";
import { API } from "@constants/index";
import type { Cita, CitaFormData } from "@appTypes";

export const citaService = {
  getAll: () =>
    http.get<Cita[]>(API.CITAS),

  getByCliente: (idCliente: number) =>
    http.get<Cita[]>(API.CITAS, { idCliente: String(idCliente) }),

  getById: (id: number) =>
    http.get<Cita>(API.CITA_BY_ID(id)),

  create: (data: CitaFormData) =>
    http.post<Cita>(API.CITAS, data),

  update: (id: number, data: CitaFormData) =>
    http.put<void>(API.CITA_BY_ID(id), data),

  delete: (id: number, idCliente: number) =>
    http.delete<void>(API.CITA_DELETE(id, idCliente)),
};
