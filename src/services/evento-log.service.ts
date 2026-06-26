import { http } from "@api/http";
import { API } from "@constants/index";
import type { EventoLog } from "@appTypes";

export const eventoLogService = {
  getAll: () =>
    http.get<EventoLog[]>(API.LOGS),

  getByModulo: (modulo: string) =>
    http.get<EventoLog[]>(`${API.LOGS}/modulo/${modulo}`),
};
