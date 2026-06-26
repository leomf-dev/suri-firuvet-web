import { http } from "@api/http";
import { API } from "@constants/index";
import type { Cliente } from "@appTypes";

export interface CreateClienteDTO {
  nombCli: string;
  apeCli: string;
  fecNac: string; // dd/MM/yyyy
  uid: string;
  idRol: 1 | 2;  // 1=usuario, 2=administrador
}

export interface UpdateClienteDTO {
  nombCli?: string;
  apeCli?: string;
  fecNac?: string;
}

export const clienteService = {
  getAll: () =>
    http.get<Cliente[]>(API.CLIENTES),

  getById: (id: number) =>
    http.get<Cliente>(API.CLIENTE_BY_ID(id)),

  create: (data: CreateClienteDTO) =>
    http.post<Cliente>(API.CLIENTES, data),

  update: (id: number, data: UpdateClienteDTO) =>
    http.put<Cliente>(API.CLIENTE_BY_ID(id), data),

  cambiarRol: (id: number, idRol: 1 | 2) =>
    http.patch<Cliente>(API.CLIENTE_ROL(id), { idRol }),

  delete: (id: number) =>
    http.delete<void>(API.CLIENTE_BY_ID(id)),
};
