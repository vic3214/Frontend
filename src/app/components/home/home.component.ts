import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { SearchService } from 'src/app/auth/services/search.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private searchService: SearchService,
    private authService: AuthService
  ) {}

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
          console.log(this.results);
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

  guardarFavorito(i: number) {
    // TODO: COmprobar que se haga cuando hay un token, sino mostrar popup para iniciar sesion
    this.authService.obtenerDatosToken().subscribe((dato: any) => {
      console.log('datoUsuario', dato);
      console.log('idRestaurante', this.results[i]._id);
      this.searchService.getUsuarioPorId(dato.uid).subscribe((usuario: any) => {
        console.log('usuario', usuario);
        usuario.usuario.listaRestaurantesFavoritos.push(this.results[i]._id);
        this.authService.editaUsuario(usuario.usuario);
      });
    });
  }

  verRestaurante(i: number) {}

  reservar(i: number) {}
}
