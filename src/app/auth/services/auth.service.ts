import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  Auth,
  AuthResponse,
  Restaurante,
  Usuario,
} from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _auth!: Auth | undefined;
  private _usuario!: Usuario;
  private _restaurante!: Restaurante;

  constructor(private http: HttpClient) {}

  get auth(): Auth {
    return { ...this._auth! };
  }

  get usuario(): Usuario {
    return { ...this._usuario };
  }

  get restaurante(): Restaurante {
    return { ...this._restaurante };
  }

  async recuperarImagen(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/recuperar-imagen/${id}`);
    const data = await response.json();
    const imagen_base64 = data.imagen;
    const imagen_binaria = atob(imagen_base64);
    const array = new Uint8Array(imagen_binaria.length);
    for (let i = 0; i < imagen_binaria.length; i++) {
      array[i] = imagen_binaria.charCodeAt(i);
    }
    const blob = new Blob([array], { type: 'image/jpeg' });

    return blob;
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
    if (datosPersonales.controls['fotografia'].value !== '') {
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
      reservas: [],
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

  editaUsuario(usuario: any) {
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );
    console.log('Enviar usuario', usuario);
    return this.http.put<any>(
      `${this.baseUrl}/editar-usuario/${usuario._id}`,
      usuario,
      {
        headers,
      }
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
            reservas: resp.reservas!,
            favoritos: resp.favoritos!,
          };
        }
      }),
      map((resp) => resp.ok)
    );
  }

  loginRestaurante(email: string, password: string) {
    const body = { email, password };
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login-restaurante`, body)
      .pipe(
        tap((resp) => {
          if (resp.ok) {
            localStorage.setItem('token-restaurante', resp.token!);
            this._restaurante = {
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
  logOutRestaurante() {
    localStorage.removeItem('token-restaurante');
    this._auth = undefined;
  }
  obtenerDatosRestauranteToken() {
    const url = `${this.baseUrl}/auth/obtener-datos-restaurante`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token-restaurante') || ''
    );

    return this.http.get<AuthResponse>(url, { headers });
  }

  obtenerDatosToken(): any {
    const url = `${this.baseUrl}/auth/obtener-datos`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp) => {
        const respuesta = {
          nombre: resp.nombre!,
          uid: resp.uid!,
          email: resp.email!,
          reservas: resp.reservas!,
          favoritos: resp.favoritos!,
        };
        return respuesta;
      }),
      catchError((err) => of(false))
    );
  }

  validarRestauranteToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renovar-restaurante`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token-restaurante') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp) => {
        localStorage.setItem('token-restaurante', resp.token!);
        this._restaurante = {
          nombre: resp.nombre!,
          uid: resp.uid!,
          email: resp.email!,
        };
        return resp.ok;
      }),
      catchError((err) => of(false))
    );
  }

  validarToken(token: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renovar`;
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem(token) || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp) => {
        localStorage.setItem(token, resp.token!);
        this._usuario = {
          nombre: resp.nombre!,
          uid: resp.uid!,
          email: resp.email!,
          reservas: resp.reservas!,
          favoritos: resp.favoritos!,
        };
        return resp.ok;
      }),
      catchError((err) => of(false))
    );
  }

  async registraRestaurante(
    datosPersonales: FormGroup,
    datosRestaurante: FormGroup,
    carta: FormGroup,
    inicioSesion: FormGroup
  ) {
    let idImagen;
    if (datosRestaurante.controls['fotografia'].value !== '') {
      await this.subirImagen(
        datosRestaurante.controls['fotografia'].value._files[0]
      ).then((resp) => (idImagen = resp.idImagen));
    } else {
      // TODO: Asignar fotografia predeterminada
      idImagen = 'Prueba';
    }
    const bodyCarta = this.construyeCarta(carta);

    const ciudad = datosRestaurante.controls['ciudad'].value;
    const calle = datosRestaurante.controls['calle'].value;
    const numero = datosRestaurante.controls['numero'].value;
    const codigoPostal = datosRestaurante.controls['codigoPostal'].value;

    const ubicacion = await this.obtenerUbicacion(
      calle,
      ciudad,
      numero,
      codigoPostal
    );

    let body: any = {
      nombrePropietario: datosPersonales.controls['nombrePropietario'].value,
      fechaNacimiento: datosPersonales.controls['fechaNacimiento'].value,
      nombre: datosRestaurante.controls['nombre'].value,
      ubicacion: ubicacion,
      tematica: datosRestaurante.controls['tematica'].value,
      horario: datosRestaurante.controls['horario'].value,
      fotografia: idImagen,
      carta: bodyCarta,
      email: inicioSesion.controls['email'].value,
      password: inicioSesion.controls['password'].value,
      comentarios: [],
      reservas: [],
      valoracion: [],
      maximoPersonasPorHora: datosRestaurante.controls['maxPersonas'],
      maximoPersonasPorReserva: datosRestaurante.controls['maxReservas'],
      vecesReservado: 0,
      vecesVisitado: 0,
    };

    return this.http
      .post<any>(`${this.baseUrl}/nuevo-restaurante`, body)
      .pipe(map((resp) => resp.ok));
  }

  editarRestaurante(restaurante: any) {
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token-restaurante') || ''
    );
    return this.http.put<any>(
      `${this.baseUrl}/editar-restaurante/${restaurante._id}`,
      restaurante,
      { headers }
    );
  }
  // Array de Arrays con valores [nombrePlato,precio,tipo]
  construyeCarta(carta: FormGroup) {
    // Filtrar por tipos y añadirlos al tipo correspondiente en el objeto bodyCarta
    const longitud = carta.controls['platos'].value.length;
    const bodyCarta: any = {
      entrantes: [],
      primerosPlatos: [],
      segundosPlatos: [],
      postres: [],
      bebidas: [],
    };

    const tipoMapeo: any = {
      Entrante: 'entrantes',
      Primero: 'primerosPlatos',
      Segundo: 'segundosPlatos',
      Postre: 'postres',
      Bebida: 'bebidas',
    };

    for (let index = 0; index < longitud; index++) {
      const plato = carta.controls['platos'].value[index];
      const tipo = tipoMapeo[plato.tipo];
      if (tipo && bodyCarta.hasOwnProperty(tipo)) {
        bodyCarta[tipo].push(plato);
      }
    }
    return bodyCarta;
  }

  async obtenerUbicacion(
    calle: String,
    ciudad: String,
    numero: String,
    codigoPostal: String
  ) {
    const direccion = `${calle} ${numero}, ${ciudad}`;
    const url = `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(
      `${numero} ${calle}`
    )}&city=${ciudad}&country=España&postalcode=${codigoPostal}&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    console.log('datos', data);

    if (data.length > 0) {
      const location = data[0];
      const latitud = location.lat;
      const longitud = location.lon;

      return [latitud, longitud];
    } else {
      throw new Error(
        `No se encontró la ubicación para la dirección: ${direccion} con código postal ${codigoPostal}`
      );
    }
  }

  cambiaPasswordRestaurante(restaurante: any) {
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token-restaurante') || ''
    );
    return this.http
      .put<any>(
        `${this.baseUrl}/editar-password-restaurante/${restaurante._id}`,
        restaurante,
        { headers }
      )
      .pipe(
        catchError((error) => {
          return of({
            ok: false,
            msg: 'Error al conectar con la base de datos para actualizar los datos',
          });
        })
      );
  }

  eliminarUsuario(usuario: any) {
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );
    return this.http.delete(`${this.baseUrl}/borrar-usuario/${usuario._id}`, {
      headers,
    });
  }

  eliminarRestaurante(restaurante: any) {
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token-restaurante') || ''
    );
    return this.http.delete(
      `${this.baseUrl}/borrar-restaurante/${restaurante._id}`,
      {
        headers,
      }
    );
  }
}
