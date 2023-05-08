import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  // TODO: Implementar paginacion en los resultados
  ngOnInit(): void {}
  searchTerm!: string;
  searchCityTerm!: string;
  results: any[] = [];
  map: L.Map | undefined;
  mapInitialized: boolean = false;
  busqueda: boolean = false;
  durationInSeconds = 3;
  imagenUrl: any[] = [];
  valoracion: number[] = [];
  numeroValoraciones: number[] = [];

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
            if (element.valoracion.length !== 0) {
              let votos = Object.values(element.valoracion).map(
                (obj: any) => obj.voto
              );
              this.numeroValoraciones.push(votos.length);
              let media = votos.reduce((a, b) => a + b) / votos.length;
              this.valoracion.push(media);
            } else {
              this.valoracion.push(0);
              this.numeroValoraciones.push(0);
            }
            this.results.push(element);
            console.log(element.fotografia);
            if (element.fotografia) {
              this.authService
                .recuperarImagen(element.fotografia)
                .then((resp) => {
                  console.log('foto', element.fotografia);
                  console.log('respuesta', resp);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    this.imagenUrl.push(e.target!.result);
                  };
                  reader.readAsDataURL(resp);
                });
            }

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
      this.map?.remove();
      this.map = undefined;
      this.iniciarMapa();
    }
  }

  valoracionRestaurante(i: number) {
    return this.valoracion[i];
  }

  numValoracionesRestaurante(i: number) {
    return this.numeroValoraciones[i];
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
            minZoom: 5,
          }
        ).addTo(this.map);
        this.mapInitialized = true;
      });
  }

  openDialog(err: any): void {
    const dialogRef = this.dialog.open(DialogHomeComponent, {
      width: '300px',
      data: { err: err },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  guardarFavorito(i: number) {
    if (localStorage.getItem('token') != null) {
      this.authService.obtenerDatosToken().subscribe((dato: any) => {
        this.searchService
          .getUsuarioPorId(dato.uid)
          .subscribe((usuario: any) => {
            if (
              usuario.usuario.listaRestaurantesFavoritos.includes(
                this.results[i]._id
              )
            ) {
              this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
                duration: this.durationInSeconds * 500,
                panelClass: ['snackBar'],
                data: {
                  mensaje: '¡Ya has guardado ese restaurante en favoritos!',
                },
              });
            } else {
              usuario.usuario.listaRestaurantesFavoritos.push(
                this.results[i]._id
              );
              this.authService
                .editaUsuario(usuario.usuario)
                .subscribe((res) => {});
            }
          });
      });
    } else {
      const erroresEnviar =
        'Debes iniciar sesión para guardar restaurantes favoritos';
      this.openDialog(erroresEnviar);
    }
  }

  verRestaurante(i: number) {
    const id = this.results[i]._id;
    console.log(id);
    this.router.navigateByUrl(`/auth/restaurante/${id}`);
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialogHome.html',
})
export class DialogHomeComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogHomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'snack-bar',
  templateUrl: 'snack.html',
  styles: [
    `
      :host {
        display: flex;
      }

      .example-pizza-party {
        color: hotpink;
      }
    `,
  ],
})
export class ComentarioAnnotatedComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
