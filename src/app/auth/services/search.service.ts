import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseUrl: string = environment.baseUrl;

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

  getCiudades(ciudad: string) {
    return this.http.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${ciudad}&countrycodes=es&featuretype=city&limit=10`
    );
  }

  getAllRestaurantes() {
    return this.http.get<any>(`${this.baseUrl}/restaurantes`);
  }
}
