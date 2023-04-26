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
  usuario: any = {};

  ngOnInit(): void {
    this.searchService
      .getUsuarioPorId(this.authService.usuario.uid)
      .subscribe((res: any) => {
        console.log('resusuario', res.usuario);
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
        console.log('results', this.results);
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

  // TODO:
  // Eliminar restauranes favoritos
  // Calcelar reserva

  logout() {
    this.authService.logOut();
    this.router.navigateByUrl('auth/login');
  }

  reservasVisibilidad() {
    console.log(this.authService.usuario);
    this.favoritos = false;
    this.reservas = true;
  }
  favoritosVisibilidad() {
    this.reservas = false;
    this.favoritos = true;
  }

  eliminarFavorito(i: number) {
    this.usuario.listaRestaurantesFavoritos.splice(i, 1);
    console.log('Usuario', this.usuario);
    this.authService.editaUsuario(this.usuario).subscribe((res) => {
      console.log('usu', res);
      this.results.splice(i, 1);
      console.log(i);
      console.log(this.results);
    });
  }

  verRestaurante(i: number) {
    const id = this.results[i]._id;
    console.log(id);
    this.router.navigateByUrl(`/auth/restaurante/${id}`);
  }
}
