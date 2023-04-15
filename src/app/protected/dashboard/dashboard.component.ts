import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  favoritos: Boolean = false;
  reservas: Boolean = true;
  get usuario() {
    return this.authService.usuario;
  }
  constructor(private router: Router, private authService: AuthService) {}

  // TODO:
  // Eliminar restauranes favoritos
  // Calcelar reserva
  // Ponerlo mas bonito en un card
  // Si hay un token en localStorage Permitir reserva y guardar favorito
  // para el usuario del token
  // Hacer dashboard parecido con restaurantes

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
}
