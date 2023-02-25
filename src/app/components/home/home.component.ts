import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Restaurante } from 'src/app/auth/interfaces/restaurante.interfaces';
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
  results: any[] = [];

  search() {
    this.results = [];
    this.searchService
      .getRestaurantesPorNombre(this.searchTerm)
      .subscribe((restaurantes: any) => {
        if (restaurantes.ok) {
          restaurantes.restaurante.forEach((element: Restaurante) => {
            this.results.push(element);
            const map = L.map('map').setView([51.505, -0.09], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);
          });
        }

        console.log('Resultados: ', this.results[0]);
      });
  }
}
