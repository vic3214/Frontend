/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
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
import { Subject, of } from 'rxjs';
import { catchError, debounceTime } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import { AuthService } from '../../../services/auth.service';
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
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private date: DateAdapter<Date>
  ) {
    date.getFirstDayOfWeek = () => 1;
  }
  
  searchTerm!: string;
  searchCityTerm!: string;
  results: any[] = [];
  resultsAux: any[] = [];
  map: L.Map | undefined;
  mapInitialized = false;
  busqueda = false;
  durationInSeconds = 3;
  imagenUrl: any[] = [];
  imagenUrlAux: any[] = [];
  valoracion: number[] = [];
  numeroValoraciones: number[] = [];
  private debouncer: Subject<string> = new Subject<string>();
  res: any[] = [];
  ordenado = [
    'Mejor valorados',
    'Peor valorados',
    'Precio más bajo',
    'Precio más alto',
    'Más visitados',
    'Menos visitados',
  ];
  checkGeolocation = false;

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(300)).subscribe((value) => {
      this.searchService
        .getCiudades(this.searchCityTerm)
        .subscribe((resp: any) => {
          this.res = [...resp];
        });
    });
  }

  getRandomComments(commentsArray: any) {
    const randomComments: any = [];
    for (let i = 0; i < 3 && i < commentsArray.length; i++) {
      let randomIndex = Math.floor(Math.random() * commentsArray.length);
      while (randomComments.includes(commentsArray[randomIndex])) {
        randomIndex = Math.floor(Math.random() * commentsArray.length);
      }
      randomComments.push(commentsArray[randomIndex]);
    }
    return randomComments;
  }

  reiniciarValoraciones(filteredResults: any) {
    this.valoracion = [];
    this.numeroValoraciones = [];
    filteredResults.forEach((element: any) => {
      this.calculaMedias(element);
    });
  }

  aplicarFiltros() {
    this.resultsAux = this.results;
    this.authService
      .obtenerFestivos(this.busquedaForm.controls['fecha'].value)
      .subscribe((resp) => {
        const festivos = resp;
        const filteredResults = this.results.filter((result) => {
          const precioMedio = this.calculaPrecioMedioCarta(result);
          const comprobacionFechaYHora = this.compruebaFecha(festivos, result);

          return (
            comprobacionFechaYHora &&
            (this.busquedaForm.controls['personas'].value === null ||
              result.maximoPersonasPorReserva >=
                this.busquedaForm.controls['personas'].value) &&
            (this.busquedaForm.controls['tematica'].value === null ||
              result.tematica.includes(this.busquedaForm.controls['tematica'].value)) &&
            (this.busquedaForm.controls['precioMin'].value === null ||
              precioMedio >= this.busquedaForm.controls['precioMin'].value) &&
            (this.busquedaForm.controls['precioMax'].value === null ||
              precioMedio <= this.busquedaForm.controls['precioMax'].value)
          );
        });
        const ordenElegido = this.busquedaForm.controls['ordenado'].value;

        if (ordenElegido === 'Mejor valorados') {
          filteredResults.sort((a, b) => {
            let valoracionMediaA = 0;
            if (a.valoracion.length !== 0) {
              valoracionMediaA =
                a.valoracion.reduce((acc: any, val: any) => acc + val.voto, 0) /
                a.valoracion.length;
            }
            let valoracionMediaB = 0;
            if (b.valoracion.length !== 0) {
              valoracionMediaB =
                b.valoracion.reduce((acc: any, val: any) => acc + val.voto, 0) /
                b.valoracion.length;
            }

            return valoracionMediaB - valoracionMediaA;
          });
          this.reiniciarValoraciones(filteredResults);
        }
        if (ordenElegido === 'Peor valorados') {
          filteredResults.sort((a, b) => {
            let valoracionMediaA = 0;
            if (a.valoracion.length !== 0) {
              valoracionMediaA =
                a.valoracion.reduce((acc: any, val: any) => acc + val.voto, 0) /
                a.valoracion.length;
            }
            let valoracionMediaB = 0;
            if (b.valoracion.length !== 0) {
              valoracionMediaB =
                b.valoracion.reduce((acc: any, val: any) => acc + val.voto, 0) /
                b.valoracion.length;
            }

            return valoracionMediaA - valoracionMediaB;
          });
          this.reiniciarValoraciones(filteredResults);
        }

        if (ordenElegido === 'Precio más bajo') {
          filteredResults.sort((a, b) => {
            const valoracionMediaA = this.calculaPrecioMedioCarta(a);

            const valoracionMediaB = this.calculaPrecioMedioCarta(b);

            return valoracionMediaA - valoracionMediaB;
          });
          this.reiniciarValoraciones(filteredResults);
        }

        if (ordenElegido === 'Precio más alto') {
          filteredResults.sort((a, b) => {
            const valoracionMediaA = this.calculaPrecioMedioCarta(a);

            const valoracionMediaB = this.calculaPrecioMedioCarta(b);

            return valoracionMediaB - valoracionMediaA;
          });
          this.reiniciarValoraciones(filteredResults);
        }

        if (ordenElegido === 'Más visitados') {
          filteredResults.sort((a, b) => {
            const valoracionMediaA = a.vecesVisitado;

            const valoracionMediaB = b.vecesVisitado;

            return valoracionMediaB - valoracionMediaA;
          });
          this.reiniciarValoraciones(filteredResults);
        }

        if (ordenElegido === 'Menos visitados') {
          filteredResults.sort((a, b) => {
            const valoracionMediaA = a.vecesVisitado;

            const valoracionMediaB = b.vecesVisitado;

            return valoracionMediaA - valoracionMediaB;
          });
          this.reiniciarValoraciones(filteredResults);
        }

        const auxArray = this.results;
        const posiciones = filteredResults.reduce(function (acc, elemento) {
          const indice = auxArray.indexOf(elemento);
          console.log(indice);
          if (indice !== -1) {
            acc.push(indice);
          }
          return acc;
        }, []);

        this.results = filteredResults;
        this.imagenUrl = [];
        for (let i = 0; i < posiciones.length; i++) {
          this.imagenUrl.push(this.imagenUrlAux[posiciones[i]]);
        }
      });
  }

  quitarFiltros() {
    this.results = [...this.resultsAux];
    this.imagenUrl = [...this.imagenUrlAux];
    this.busquedaForm.reset({
      fecha: null,
      personas: null,
      tematica: null,
      precioMin: null,
      precioMax: null,
      ordenado: null,
    });
  }

  compruebaFecha(festivos: any, result: any) {
    const days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    let dias = false;
    if (this.busquedaForm.controls['fecha'].value !== null) {
      const date = this.busquedaForm.controls['fecha'].value;
      const day = days[date.getDay()];

      for (let i = 0; i < result.horario.length; i++) {
        if (!dias) {
          dias = result.horario[i].dias.includes(day);
        }
      }
    } else {
      dias = true;
    }
    console.log('cumple dias', dias);

    let fest = false;
    for (let i = 0; i < festivos.length; i++) {
      if (!fest) {
        fest = festivos[i].location.includes(this.searchCityTerm);
      }
    }

    return !fest && dias;
  }

  calculaPrecioMedioCarta(restaurante: any) {
    let precioMedio = 0;
    let numPlatos = 0;
    const keys = [
      'entrantes',
      'primerosPlatos',
      'segundosPlatos',
      'postres',
      'bebidas',
    ];
    for (const key of keys) {
      for (let i = 0; i < restaurante.carta[key].length; i++) {
        numPlatos += 1;
        precioMedio += restaurante.carta[key][i].precio;
      }
    }
    if (numPlatos === 0) {
      return 0;
    }
    return precioMedio / numPlatos;
  }
  calculaMedias(element: any) {
    if (element.valoracion.length !== 0) {
      const votos = Object.values(element.valoracion).map((obj: any) => obj.voto);
      this.numeroValoraciones.push(votos.length);
      const media = votos.reduce((a, b) => a + b) / votos.length;
      this.valoracion.push(media);
    } else {
      this.valoracion.push(0);
      this.numeroValoraciones.push(0);
    }
  }

  asignaValor(ciudad: any) {
    this.searchCityTerm = ciudad;
    this.res = [];
  }

  mostrarSugerencias(event: any) {
    this.debouncer.next();
  }

  busquedaForm: FormGroup = this._formBuilder.group({
    fecha: [],
    personas: [],
    tematica: [],
    precioMin: [],
    precioMax: [],
    ordenado: [],
  });

  async search() {
    this.res = [];
    this.busqueda = true;
    this.results = [];

    if (this.searchCityTerm === undefined) {
      this.searchCityTerm = 'Madrid';
    }

    if (this.searchTerm === undefined) {
      this.searchTerm = 'Buscar todos';
    }

    if (this.checkGeolocation) {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            this.searchCityTerm =
              await this.searchService.getCiudadDesdeUbicacion(
                position.coords.latitude,
                position.coords.longitude
              );
            resolve();
          },
          function (err) {
            console.error('Error', err);
            reject(err);
          },
          { maximumAge: 0, timeout: 5000, enableHighAccuracy: true }
        );
      });
    }

    this.searchService
      .getRestaurantesPorCiudadYNombre(this.searchTerm, this.searchCityTerm)
      .subscribe((restaurantes: any) => {
        console.log(restaurantes);
        if (restaurantes.ok) {
          restaurantes.restaurantes.forEach((element: any) => {
            this.calculaMedias(element);
            this.results.push(element);
            if (element.fotografia !== undefined && element.fotografia !== '') {
              this.authService
                .recuperarImagen(element.fotografia)
                .then((resp) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    this.imagenUrl.push(e.target!.result);
                  };
                  reader.readAsDataURL(resp);
                });
            }
            this.imagenUrlAux = this.imagenUrl;

            // Crear el marcador para el restaurante
            const marker = L.marker([element.ubicacion[0], element.ubicacion[1]])
              .bindPopup(element.nombre)
              .openPopup();
            // Añadir el marcador al mapa
            marker.addTo(this.map!);

            // Geolocalizacion
            let markerGeo;
            console.log('check');
            console.log(this.checkGeolocation);
            if (this.checkGeolocation) {
              let browserLat;
              let browserLong;
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  browserLat = position.coords.latitude;
                  browserLong = position.coords.longitude;

                  markerGeo = L.marker([browserLat, browserLong]).addTo(
                    this.map!
                  );
                  markerGeo.bindPopup('Estás aquí').openPopup();
                  this.map!.setView([browserLat, browserLong], 15);
                  markerGeo.addTo(this.map!);
                },
                function (err) {
                  console.error('Error', err);
                },
                { maximumAge: 0, timeout: 5000, enableHighAccuracy: true }
              );
            }
          });
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
    let latitud = 0;
    let longitud = 0;
    this.searchService
      .getUbicacionDesdeCiudad(this.searchCityTerm)
      .pipe(
        catchError((error: any) => {
          this.openDialog(error.error.msg);
          return of();
        })
      )
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
              this.authService.editaUsuario(usuario.usuario).subscribe({
                error: (err) => {
                  this._snackBar.openFromComponent(
                    ComentarioAnnotatedComponent,
                    {
                      duration: this.durationInSeconds * 500,
                      panelClass: ['snackBar'],
                      data: {
                        mensaje:
                          '¡Hubo un error al guardar este restaurante en favoritos!',
                      },
                    }
                  );
                },
                complete: () => {
                  this._snackBar.openFromComponent(
                    ComentarioAnnotatedComponent,
                    {
                      duration: this.durationInSeconds * 500,
                      panelClass: ['snackBar'],
                      data: {
                        mensaje: '¡Restaurante guardado en favoritos!',
                      },
                    }
                  );
                },
              });
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
    this.results[i].vecesVisitado += 1;
    this.authService
      .editarRestaurante(this.results[i])
      .subscribe((resp: any) => {
        this.router.navigateByUrl(`/auth/restaurante/${id}`);
      });
  }

  precioMedioRestaurante(rest:any){
    return this.calculaPrecioMedioCarta(rest).toPrecision(3)
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
    `,
  ],
})
export class ComentarioAnnotatedComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
