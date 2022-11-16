export interface Auth {
  id: string;
  email: string;
  usuario: string;
}

export interface AuthResponse {
  ok: boolean;
  uid?: string;
  name?: string;
  email?: string;
  token?: string;
  msg?: string;
}

export interface Usuario {
  uid: string;
  name: string;
  email: string;
}
