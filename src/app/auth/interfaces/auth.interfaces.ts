export interface Auth {
  id: string;
  email: string;
  usuario: string;
}

export interface AuthResponse {
  ok: boolean;
  uid?: string;
  nombre?: string;
  email?: string;
  token?: string;
  msg?: string;
}

export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
}
