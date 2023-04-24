import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-restaurante',
  templateUrl: './dashboard-restaurante.component.html',
  styleUrls: ['./dashboard-restaurante.component.css'],
})
export class DashboardRestauranteComponent {
  favoritos: Boolean = false;
  reservas: Boolean = true;
  get restaurante() {
    return this.authService.restaurante;
  }
  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logOutRestaurante();
    this.router.navigateByUrl('auth/loginRestaurante');
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
}
