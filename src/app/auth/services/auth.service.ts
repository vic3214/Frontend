import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Auth, AuthResponse, Usuario } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _auth!: Auth | undefined;
  private _usuario!: Usuario;

  constructor(private http: HttpClient) {}

  get auth(): Auth {
    return { ...this._auth! };
  }

  get usuario(): Usuario {
    return { ...this._usuario };
  }

  async subirImagen(imagen: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(imagen);
      reader.onloadend = () => {
        const buffer = reader.result as ArrayBuffer;
        const imagen_array = Array.from(new Uint8Array(buffer));
        const imagen_base64 = btoa(String.fromCharCode(...imagen_array));
        const url = `${this.baseUrl}/subir-imagen`;
        const body = { imagen: imagen_base64 };
        this.http
          .post(url, body)
          .toPromise()
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
  async registraUsuario(datosPersonales: FormGroup, inicioSesion: FormGroup) {
    let idImagen;
    if (datosPersonales.controls['fotografia'].value !== null) {
      await this.subirImagen(
        datosPersonales.controls['fotografia'].value._files[0]
      ).then((resp) => (idImagen = resp.idImagen));
    } else {
      // TODO: Asignar fotografia predeterminada
    }

    let anio = datosPersonales.controls['fechaNacimiento'].value.getFullYear();
    let dia = datosPersonales.controls['fechaNacimiento'].value.getDay();
    let mes = datosPersonales.controls['fechaNacimiento'].value.getMonth();
    const fechaNacimientoParseada = `${anio}-${mes}-${dia}`;

    let body: any = {
      nombre: datosPersonales.controls['nombre'].value,
      email: inicioSesion.controls['email'].value,
      password: inicioSesion.controls['password'].value,
      listaRestaurantesFavoritos: [],
      fotografia: idImagen,
      listaOpiniones: [],
      fechaNacimiento: fechaNacimientoParseada,
      google: false,
    };

    return this.http
      .post<any>(`${this.baseUrl}/nuevo-usuario`, body)
      .pipe(map((resp) => resp.ok));
  }

  verificaAutenticacion(): Observable<boolean> {
    if (!localStorage.getItem('token')) {
      return of(false); // Creamos el observable del false
    }
    return this.http.get<Auth>(`${this.baseUrl}/login`).pipe(
      map((auth) => {
        this._auth = auth;
        return true;
      })
    );
  }

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          localStorage.setItem('token', resp.token!);
          this._usuario = {
            nombre: resp.nombre!,
            uid: resp.uid!,
            email: resp.email!,
          };
        }
      }),
      map((resp) => resp.ok)
    );
  }

  logOut() {
    localStorage.removeItem('token');
    this._auth = undefined;
  }

  validarToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renovar`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp) => {
        localStorage.setItem('token', resp.token!);
        this._usuario = {
          nombre: resp.nombre!,
          uid: resp.uid!,
          email: resp.email!,
        };
        return resp.ok;
      }),
      catchError((err) => of(false))
    );
  }
}
