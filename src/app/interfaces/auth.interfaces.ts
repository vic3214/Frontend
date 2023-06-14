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
  reservas?: string[];
  favoritos?: string[];
  restaurante?: any;
}

export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  reservas: string[];
  favoritos: string[];
}

export interface Restaurante {
  uid: string;
  nombre: string;
  email: string;
}
