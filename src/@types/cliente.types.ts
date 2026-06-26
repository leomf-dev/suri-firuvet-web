export interface Cliente {
  id: number;
  nombCli: string;
  apeCli: string;
  fecNac: string; // dd/MM/yyyy
  uid: string;
  idRol: number;       // 1=usuario, 2=administrador
  rolNombre: string;
}

export interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  fecNac?: string;
}
