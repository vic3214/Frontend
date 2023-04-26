import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-restaurante',
  templateUrl: './dashboard-restaurante.component.html',
  styleUrls: ['./dashboard-restaurante.component.css'],
})
export class DashboardRestauranteComponent implements OnInit {
  editar: Boolean = false;
  reservas: Boolean = true;
  restaurante: any;
  ngOnInit(): void {
    console.log(
      'token validado: ',
      this.authService.validarRestauranteToken().subscribe((res) => {
        console.log('res token', res);
      })
    );
    console.log('token-restaurante', localStorage.getItem('token-restaurante'));
    if (
      localStorage.getItem('token-restaurante') &&
      this.authService.validarRestauranteToken()
    ) {
      this.restaurante = this.authService
        .obtenerDatosToken()
        .subscribe((res: any) => {
          console.log('resp', res);
        });
    }
  }
  /*   get restaurante() {
    return this.authService.restaurante;
  } */
  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    this.authService.logOutRestaurante();
    this.router.navigateByUrl('auth/loginRestaurante');
  }

  reservasVisibilidad() {
    this.editar = false;
    this.reservas = true;
  }
  editarDatos() {
    this.reservas = false;
    this.editar = true;
  }
}
