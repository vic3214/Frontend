import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getRestaurantesPorCiudadYNombre(nombre: string, ciudad: string) {
    return this.http.get(`${this.baseUrl}/restaurantes/${nombre}/${ciudad}`);
  }

  getUbicacionDesdeCiudad(ciudad: string) {
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
      `https://nominatim.openstreetmap.org/search?format=json&q=*${ciudad}*&countrycodes=es&featuretype=city,town,village&limit=10`
    );
  }

  getAllRestaurantes() {
    return this.http.get<any>(`${this.baseUrl}/restaurantes`);
  }

  async getCiudadDesdeUbicacion(latitud: any, longitud: any) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitud}&lon=${longitud}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.address.city) {
      return data.address.city;
    } else {
      return data.address.village;
    }
  }
}
