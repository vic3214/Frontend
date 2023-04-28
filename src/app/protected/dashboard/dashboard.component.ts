import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SearchService } from 'src/app/auth/services/search.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  favoritos: Boolean = false;
  reservas: Boolean = true;
  results: any[] = [];
  resultsReservas: any[] = [];
  usuario: any = {};
  indicesOcultar: number[] = [];

  ngOnInit(): void {
    this.searchService
      .getUsuarioPorId(this.authService.usuario.uid)
      .subscribe((res: any) => {
        this.usuario = res.usuario;

        for (
          let i = 0;
          i < this.usuario.listaRestaurantesFavoritos.length;
          i++
        ) {
          this.searchService
            .getRestaurantePorId(this.usuario.listaRestaurantesFavoritos[i])
            .subscribe((res: any) => {
              this.results.push(res.restaurante);
            });
        }

        for (let i = 0; i < this.usuario.reservas.length; i++) {
          this.searchService
            .getRestaurantePorId(this.usuario.reservas[i].uidRestaurante)
            .subscribe((res: any) => {
              this.resultsReservas.push(res.restaurante);
            });
        }
      });
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private searchService: SearchService
  ) {}

  get getUsuario() {
    return this.usuario;
  }

  get getResult() {
    return this.results;
  }

  get getResultsReservas() {
    return this.resultsReservas;
  }

  logout() {
    this.authService.logOut();
    this.router.navigateByUrl('auth/login');
  }

  reservasVisibilidad() {
    this.favoritos = false;
    this.reservas = true;
  }
  favoritosVisibilidad() {
    this.reservas = false;
    this.favoritos = true;
  }

  eliminarFavorito(i: number) {
    this.usuario.listaRestaurantesFavoritos.splice(i, 1);
    this.authService.editaUsuario(this.usuario).subscribe((res) => {
      this.results.splice(i, 1);
    });
  }

  verRestaurante(i: number) {
    const id = this.results[i]._id;
    this.router.navigateByUrl(`/auth/restaurante/${id}`);
  }

  cancelarReserva(i: number) {
    const idReserva = this.usuario.reservas[i].uidReserva;
    this.usuario.reservas.splice(i, 1);
    const indiceReservaEliminar = this.resultsReservas[i].reservas.findIndex(
      (r: any) => r._id === idReserva
    );
    this.resultsReservas[i].reservas.splice(indiceReservaEliminar, 1);
    this.authService.editaUsuario(this.usuario).subscribe((res: any) => {});
    this.authService
      .editarRestaurante(this.resultsReservas[i])
      .subscribe((res: any) => {
        this.resultsReservas.splice(i, 1);
      });
  }
}
