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

  getRestaurantesPorNombre(nombre: String) {
    return this.http.get(`${this.baseUrl}/restaurantes/${nombre}`);
  }
}
