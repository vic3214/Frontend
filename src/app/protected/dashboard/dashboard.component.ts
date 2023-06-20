/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';

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
  imagenUrl: any = '';

  ngOnInit(): void {
    this.searchService
      .getUsuarioPorId(this.authService.usuario.uid)
      .subscribe((res: any) => {
        this.usuario = res.usuario;

        this.authService
          .recuperarImagen(this.usuario.fotografia)
          .then((resp) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              this.imagenUrl = e.target!.result;
            };
            reader.readAsDataURL(resp);
          });

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
              for (let j = 0; j < res.restaurante.reservas.length; j++) {
                if (
                  this.usuario.reservas[i].uidReserva ===
                  res.restaurante.reservas[j].uidReserva
                ) {
                  this.resultsReservas.push({
                    restaurante: res.restaurante,
                    reserva: res.restaurante.reservas[j],
                  });
                }
              }
            });
        }
        console.log('Reservas', this.resultsReservas);
      });
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private searchService: SearchService,
    public dialog: MatDialog
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
    console.log(this.resultsReservas[i]);
    const id = this.resultsReservas[i].restaurante._id;
    this.resultsReservas[i].restaurante.vecesVisitado += 1;
    this.authService
      .editarRestaurante(this.resultsReservas[i].restaurante)
      .subscribe((resp: any) => {
        this.router.navigateByUrl(`/auth/restaurante/${id}`);
      });
  }

  cancelarReserva(i: number) {
    this.usuario.reservas[i].estado = true;
    this.authService.editaUsuario(this.usuario).subscribe((res: any) => {});
    const indiceReserva = this.resultsReservas[
      i
    ].restaurante.reservas.findIndex(
      (reserva: any) =>
        reserva.uidReserva === this.resultsReservas[i].reserva.uidReserva
    );
    this.resultsReservas[i].restaurante.reservas[indiceReserva].estado = true;
    this.authService
      .editarRestaurante(this.resultsReservas[i].restaurante)
      .subscribe((resp) => {});
  }

  eliminarReserva(i: number) {
    this.resultsReservas.splice(i, 1);
    this.usuario.reservas.splice(i, 1);
    this.authService.editaUsuario(this.usuario).subscribe((res: any) => {});
  }

  eliminaCuenta() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: { mensaje: '¿Estás seguro de que quieres eliminar tu cuenta?' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.authService.eliminarUsuario(this.usuario).subscribe((resp) => {});
        localStorage.removeItem('token');
        this.router.navigateByUrl('auth/login');
      }
    });
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
    <h1 mat-dialog-title>Confirmación</h1>
    <div mat-dialog-content>
      <p>{{ data.mensaje }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">No</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Sí</button>
    </div>
  `,
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
