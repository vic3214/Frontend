import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { SearchService } from 'src/app/auth/services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private searchService: SearchService) {}

  ngOnInit(): void {}

  searchTerm!: string;
  searchCityTerm!: string;
  results: any[] = [];
  map: L.Map | undefined;
  mapInitialized: boolean = false;
  busqueda: boolean = false;

  search() {
    this.busqueda = true;
    this.results = [];
    if (this.searchCityTerm === undefined) {
      this.searchCityTerm = 'Madrid';
    }
    console.log('Esperate');
    this.searchService
      .getRestaurantesPorCiudadYNombre(this.searchTerm, this.searchCityTerm)
      .subscribe((restaurantes: any) => {
        if (restaurantes.ok) {
          restaurantes.restaurantes.forEach((element: any) => {
            this.results.push(element);
            // Crear el marcador para el restaurante
            const marker = L.marker([
              element.ubicacion[0],
              element.ubicacion[1],
            ])
              .bindPopup(element.nombre)
              .openPopup();
            // Añadir el marcador al mapa
            marker.addTo(this.map!);
          });
        }
      });

    if (!this.mapInitialized) {
      this.iniciarMapa();
    } else {
      //TODO: Reinicializar el mapa
      this.map?.remove();
      this.map = undefined;
      this.iniciarMapa();
    }
  }

  iniciarMapa() {
    let latitud: number = 0;
    let longitud: number = 0;
    console.log('Esperate2');
    this.searchService
      .getUbicacionDesdeCiudad(this.searchCityTerm)
      .subscribe((resp: any) => {
        latitud = Number.parseFloat(resp.latitud);
        longitud = Number.parseFloat(resp.longitud);
        this.map = L.map('map').setView([latitud, longitud], 13);
        L.tileLayer(
          'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
          {
            attribution:
              'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 18,
          }
        ).addTo(this.map);
        this.mapInitialized = true;
      });
  }
}
