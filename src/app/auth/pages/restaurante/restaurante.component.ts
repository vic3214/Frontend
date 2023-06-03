import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import {
  ComentarioAnnotatedComponent,
  DialogHomeComponent,
} from 'src/app/auth/pages/home/home.component';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.component.html',
  styleUrls: ['./restaurante.component.css'],
})
export class RestauranteComponent implements OnInit {
  @ViewChild('myTabGroup') myTabGroup!: MatTabGroup;
  minDate = new Date();
  id: string = '';
  restaurante: any;
  valoracion: number = 0;
  numeroValoraciones: number = 0;
  durationInSeconds = 5;
  usuario: any;
  sesionIniciada!: boolean;
  imagenUrlPostres: any[] = [];
  imagenUrlBebidas: any[] = [];
  imagenUrlEntrantes: any[] = [];
  imagenUrlPrimeros: any[] = [];
  imagenUrlSegundos: any[] = [];
  numerosGenerados: string[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private date: DateAdapter<Date>,
    private searchService: SearchService,
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    date.getFirstDayOfWeek = () => 1;
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';

    this.searchService.getRestaurantePorId(this.id).subscribe((res: any) => {
      this.restaurante = res.restaurante;
      if (this.restaurante.valoracion.length !== 0) {
        let votos = Object.values(this.restaurante.valoracion).map(
          (obj: any) => obj.voto
        );
        this.numeroValoraciones = votos.length;
        let media = votos.reduce((a, b) => a + b) / votos.length;
        this.valoracion = media;
      }

      for (let i = 0; i < this.restaurante.carta.entrantes.length; i++) {
        console.log(i);
        if (
          this.restaurante.carta.entrantes[i].fotografiaPlato !== undefined &&
          this.restaurante.carta.entrantes[i].fotografiaPlato !== null &&
          this.restaurante.carta.entrantes[i].fotografiaPlato !== ''
        ) {
          console.log('ent', this.restaurante.carta.entrantes[i]);
          this.authService
            .recuperarImagen(
              this.restaurante.carta.entrantes[i].fotografiaPlato
            )
            .then((resp) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                this.imagenUrlEntrantes.push(e.target!.result);
              };
              reader.readAsDataURL(resp);
            });
        }
      }
      for (let i = 0; i < this.restaurante.carta.primerosPlatos.length; i++) {
        if (
          this.restaurante.carta.primerosPlatos[i].fotografiaPlato !==
            undefined &&
          this.restaurante.carta.primerosPlatos[i].fotografiaPlato !== null &&
          this.restaurante.carta.primerosPlatos[i].fotografiaPlato !== ''
        ) {
          console.log('primeros', this.restaurante.carta.primerosPlatos[i]);
          this.authService
            .recuperarImagen(
              this.restaurante.carta.primerosPlatos[i].fotografiaPlato
            )
            .then((resp) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                this.imagenUrlPrimeros.push(e.target!.result);
              };
              reader.readAsDataURL(resp);
            });
        }
      }
      for (let i = 0; i < this.restaurante.carta.segundosPlatos.length; i++) {
        if (
          this.restaurante.carta.segundosPlatos[i].fotografiaPlato !==
            undefined &&
          this.restaurante.carta.segundosPlatos[i].fotografiaPlato !== null &&
          this.restaurante.carta.segundosPlatos[i].fotografiaPlato !== ''
        ) {
          console.log(
            'segundosPlatos',
            this.restaurante.carta.segundosPlatos[i]
          );
          this.authService
            .recuperarImagen(
              this.restaurante.carta.segundosPlatos[i].fotografiaPlato
            )
            .then((resp) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                this.imagenUrlSegundos.push(e.target!.result);
              };
              reader.readAsDataURL(resp);
            });
        }
      }

      for (let i = 0; i < this.restaurante.carta.bebidas.length; i++) {
        if (
          this.restaurante.carta.bebidas[i].fotografiaPlato !== undefined &&
          this.restaurante.carta.bebidas[i].fotografiaPlato !== null &&
          this.restaurante.carta.bebidas[i].fotografiaPlato !== ''
        ) {
          console.log('bebidas', this.restaurante.carta.bebidas[i]);
          this.authService
            .recuperarImagen(this.restaurante.carta.bebidas[i].fotografiaPlato)
            .then((resp) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                this.imagenUrlBebidas.push(e.target!.result);
              };
              reader.readAsDataURL(resp);
            });
        }
      }
      for (let i = 0; i < this.restaurante.carta.postres.length; i++) {
        if (
          this.restaurante.carta.postres[i].fotografiaPlato !== undefined &&
          this.restaurante.carta.postres[i].fotografiaPlato !== null &&
          this.restaurante.carta.postres[i].fotografiaPlato !== ''
        ) {
          console.log('postres', this.restaurante.carta.postres[i]);
          this.authService
            .recuperarImagen(this.restaurante.carta.postres[i].fotografiaPlato)
            .then((resp) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                this.imagenUrlPostres.push(e.target!.result);
              };
              reader.readAsDataURL(resp);
            });
        }
      }
    });
    this.authService.obtenerDatosToken().subscribe((res: any) => {
      this.searchService.getUsuarioPorId(res.uid).subscribe((res: any) => {
        this.usuario = res.usuario;
      });
    });
  }

  get getSesionIniciada() {
    if (localStorage.getItem('token') === null) {
      this.sesionIniciada = false;
    } else {
      this.sesionIniciada = true;
    }
    return this.sesionIniciada;
  }

  get valoracionRestaurante() {
    return this.valoracion;
  }

  get numValoracionesRestaurante() {
    return this.numeroValoraciones;
  }
  reservasGroup: FormGroup = this._formBuilder.group({
    nombre: new FormControl([], [Validators.required]),
    fecha: new FormControl([], [Validators.required]),
    hora: new FormControl([], [Validators.required]),
    personas: new FormControl([], [Validators.required]),
  });

  comentarioGroup: FormGroup = this._formBuilder.group({
    comentario: ['', Validators.required],
  });

  valoracionGroup: FormGroup = this._formBuilder.group({
    valoracion: ['', Validators.required],
  });

  addValoracion() {
    const valoracion = this.valoracionGroup.get('valoracion')!.value;
    if (localStorage.getItem('token') === null) {
      this.openSnackBar('¡Debes iniciar sesión para valorar!');
    } else if (
      valoracion !== '' &&
      Number(valoracion) <= 5 &&
      Number(valoracion) >= 0
    ) {
      let usuario;
      this.authService.obtenerDatosToken().subscribe((resp: any) => {
        usuario = resp.nombre;
        const valoracionObj = {
          usuario: usuario,
          voto: valoracion,
        };
        this.restaurante.valoracion.push(valoracionObj);
        this.valoracionGroup.get('valoracion')!.reset();
        this.authService
          .editarRestaurante(this.restaurante)
          .subscribe((resp) => {
            let votos = this.restaurante.valoracion.map((obj: any) => obj.voto);
            this.valoracion =
              votos.reduce((a: any, b: any) => a + b) / votos.length;
            this.numeroValoraciones = votos.length;
          });
      });
    } else {
      this.openSnackBar('¡Debes puntuar el restaurante correctamente!');
    }
  }

  addComentario() {
    const comentario = this.comentarioGroup.get('comentario')!.value;
    if (localStorage.getItem('token') === null) {
      this.openSnackBar('¡Debes iniciar sesión para comentar!');
    } else if (comentario !== '' && comentario.trim().length > 0) {
      let usuario;
      this.authService.obtenerDatosToken().subscribe((resp: any) => {
        usuario = resp.nombre;
        const comentarioObj = {
          comentario: comentario,
          usuario: usuario,
        };
        this.restaurante.comentarios.push(comentarioObj);
        this.comentarioGroup.get('comentario')!.reset();
        this.authService
          .editarRestaurante(this.restaurante)
          .subscribe((resp) => {});
      });
    } else {
      this.openSnackBar('¡Debes escribir algo en el comentario!');
    }
  }
  openSnackBar(mensaje: string) {
    this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
      duration: this.durationInSeconds * 500,
      panelClass: ['snackBar'],
      data: { mensaje: mensaje },
    });
  }
  generarNumeroAleatorio(longitud: any): string {
    let caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < longitud; i++) {
      resultado += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }
    return resultado;
  }

  generarNumeroUnico(): string {
    let numeroAleatorio = this.generarNumeroAleatorio(20);
    while (this.numerosGenerados.includes(numeroAleatorio)) {
      numeroAleatorio = this.generarNumeroAleatorio(20);
    }
    this.numerosGenerados.push(numeroAleatorio);
    return numeroAleatorio;
  }

  reservar() {
    if (
      this.restaurante.maximoPersonasPorReserva <
      this.reservasGroup.controls['personas'].value
    ) {
      this.dialog.open(DialogHomeComponent, {
        width: '400px',
        data: {
          err: `Este restaurante permite un máximo de ${this.restaurante.maximoPersonasPorReserva} personas por reserva`,
        },
      });

      return;
    }

    // Controlar numero de reservas y personas
    if (
      this.restaurante.maximoPersonasPorHora <
      this.getNumeroPersonasPorHora(
        this.reservasGroup.controls['hora'].value.slice(0, -2) + '00'
      ) +
        this.reservasGroup.controls['personas'].value
    ) {
      this.dialog.open(DialogHomeComponent, {
        width: '400px',
        data: {
          err: `El restaurante no tiene disponibilidad para ${this.reservasGroup.controls['personas'].value} personas a las ${this.reservasGroup.controls['hora'].value}`,
        },
      });

      return;
    }
    // Controlamos fecha local para que se guarde en mongo correctamente la fecha seleccionada
    const year = this.reservasGroup.controls['fecha'].value.getFullYear();
    const mes = this.reservasGroup.controls['fecha'].value.getMonth() + 1;
    const dia = this.reservasGroup.controls['fecha'].value.getDate();
    const fecha = `${year}-${mes.toString().padStart(2, '0')}-${dia
      .toString()
      .padStart(2, '0')}T00:00:00Z`;

    const date = new Date(fecha);

    if (this.reservasGroup.valid && localStorage.getItem('token') != null) {
      const reserva: any = {
        uidReserva: this.generarNumeroUnico(),
        uidUsuario: this.usuario._id,
        usuario: this.reservasGroup.controls['nombre'].value,
        personas: this.reservasGroup.controls['personas'].value,
        hora: this.reservasGroup.controls['hora'].value,
        fecha: date,
        estado: false,
      };
      this.restaurante.reservas.push(reserva);
      this.restaurante.vecesReservado += 1;
      this.authService.editarRestaurante(this.restaurante).subscribe((resp) => {
        reserva['uidRestaurante'] = resp.restaurante._id;

        this.usuario.reservas.push(reserva);
        this.authService.editaUsuario(this.usuario).subscribe({
          error: (error: Error) => {
            this.openSnackBar(
              'Hubo un problema al realizar la reserva: ' + error.message
            );
          },
          complete: () => {
            this.openSnackBar('¡Reserva realizada con éxito!');
          },
        });
      });
    } else {
      this.openSnackBar('¡Debes iniciar sesión para hacer una reserva!');
    }
  }

  getNumeroPersonasPorHora(horaIntervalo: string) {
    const horas = this.restaurante.reservas.map((reserva: any) => {
      return {
        horaReserva: reserva.hora.slice(0, -2) + '00',
        personas: reserva.personas,
      };
    });
    console.log(horas);
    const horasIgualIntervalo = horas.filter((horaArray: any) => {
      return horaArray.horaReserva === horaIntervalo;
    });
    const numPersonasArray = horasIgualIntervalo.map((hora: any) => {
      return hora.personas;
    });
    const numPersonas = numPersonasArray.reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue,
      0
    );

    return numPersonas;
  }
}
