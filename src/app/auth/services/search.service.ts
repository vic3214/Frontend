import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseUrl: string = environment.baseUrl;
  // http://localhost:4000/api/restaurantes

  constructor(private http: HttpClient) {}

  getRestaurantesPorCiudadYNombre(nombre: String, ciudad: String) {
    return this.http.get(`${this.baseUrl}/restaurantes/${nombre}/${ciudad}`);
  }

  getUbicacionDesdeCiudad(ciudad: String) {
    return this.http.get(`${this.baseUrl}/restaurantes/${ciudad}`);
  }

  getRestaurantePorId(id: string) {
    return this.http.get(`${this.baseUrl}/restaurante/${id}`);
  }

  getUsuarioPorId(id: string) {
    return this.http.get(`${this.baseUrl}/usuario/${id}`);
  }
}
