/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { AuthService } from '../../../services/auth.service';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.component.html',
  styleUrls: ['./restaurante.component.css'],
})
export class RestauranteComponent implements OnInit {
  @ViewChild('myTabGroup') myTabGroup!: MatTabGroup;
  minDate = new Date();
  id = '';
  restaurante: any;
  valoracion = 0;
  numeroValoraciones = 0;
  durationInSeconds = 5;
  usuario: any;
  sesionIniciada!: boolean;
  imagenUrlPostres: any[] = [];
  imagenUrlBebidas: any[] = [];
  imagenUrlEntrantes: any[] = [];
  imagenUrlPrimeros: any[] = [];
  imagenUrlSegundos: any[] = [];
  numerosGenerados: string[] = [];
  loader=false;
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
    this.loader=true;
    this.searchService.getRestaurantePorId(this.id).subscribe((res: any) => {
      this.restaurante = res.restaurante;
      if (this.restaurante.valoracion.length !== 0) {
        const votos = Object.values(this.restaurante.valoracion).map(
          (obj: any) => obj.voto
        );
        this.numeroValoraciones = votos.length;
        const media = votos.reduce((a, b) => a + b) / votos.length;
        this.valoracion = media;
      }

      const entrantesConImagenes = this.restaurante.carta.entrantes.filter(
        (plato:any) => plato.fotografiaPlato !== undefined && plato.fotografiaPlato !== null && plato.fotografiaPlato !== ''
      );
      
      Promise.all(
        entrantesConImagenes.map((plato:any) => this.authService.recuperarImagen(plato.fotografiaPlato))
      ).then(respuestas => {
        respuestas.forEach((resp, i) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagenUrlEntrantes[i] = e.target!.result;
          };
          reader.readAsDataURL(resp);
        });
      }).finally(() => {
        this.loader=false;
      });;

      const primerosPlatosConImagenes = this.restaurante.carta.primerosPlatos.filter(
        (plato:any) => plato.fotografiaPlato !== undefined && plato.fotografiaPlato !== null && plato.fotografiaPlato !== ''
      );
      
      Promise.all(
        primerosPlatosConImagenes.map((plato:any) => this.authService.recuperarImagen(plato.fotografiaPlato))
      ).then(respuestas => {
        respuestas.forEach((resp, i) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagenUrlPrimeros[i] = e.target!.result;
          };
          reader.readAsDataURL(resp);
        });
      });

      const segundosPlatosConImagenes = this.restaurante.carta.segundosPlatos.filter(
        (plato:any)  => plato.fotografiaPlato !== undefined && plato.fotografiaPlato !== null && plato.fotografiaPlato !== ''
      );
      
      Promise.all(
        segundosPlatosConImagenes.map((plato:any)  => this.authService.recuperarImagen(plato.fotografiaPlato))
      ).then(respuestas => {
        respuestas.forEach((resp, i) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagenUrlSegundos[i] = e.target!.result;
          };
          reader.readAsDataURL(resp);
        });
      });
      
      const bebidasConImagenes = this.restaurante.carta.bebidas.filter(
        (plato:any)  => plato.fotografiaPlato !== undefined && plato.fotografiaPlato !== null && plato.fotografiaPlato !== ''
      );
      
      Promise.all(
        bebidasConImagenes.map((plato:any)  => this.authService.recuperarImagen(plato.fotografiaPlato))
      ).then(respuestas => {
        respuestas.forEach((resp, i) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagenUrlBebidas[i] = e.target!.result;
          };
          reader.readAsDataURL(resp);
        });
      });
      
      const postresConImagenes = this.restaurante.carta.postres.filter(
        (plato:any)  => plato.fotografiaPlato !== undefined && plato.fotografiaPlato !== null && plato.fotografiaPlato !== ''
      );

      Promise.all(
        postresConImagenes.map((plato:any)  => this.authService.recuperarImagen(plato.fotografiaPlato))
      ).then(respuestas => {
        respuestas.forEach((resp, i) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagenUrlPostres[i] = e.target!.result;
          };
          reader.readAsDataURL(resp);
        });
      })

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
            const votos = this.restaurante.valoracion.map((obj: any) => obj.voto);
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
          // eslint-disable-next-line @typescript-eslint/no-empty-function
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
    const caracteres =
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


    const year = this.reservasGroup.controls['fecha'].value.getUTCFullYear();
    const mes = this.reservasGroup.controls['fecha'].value.getUTCMonth() + 1;
    const dia1 = this.reservasGroup.controls['fecha'].value.getDate();
    const fecha = `${year}-${mes.toString().padStart(2, '0')}-${dia1
      .toString()
      .padStart(2, '0')}T05:00:00Z`;
    
    const date = new Date(fecha);
    date.setHours(12)
console.log('date',date);
    // Comprobamos que el restaurante abre ese dia y a esa hora
    const diaSemana = date.getDay();
    console.log(diaSemana);
    const horario = this.restaurante.horario.find((obj: any) => {
      const dias = obj.dias.map((dia: string) => {
        console.log('dia',dia);
        if (dia === 'Domingo') {
          return 0;
        } else if (dia === 'Lunes') {
          return 1;
        } else if (dia === 'Martes') {
          return 2;
        } else if (dia === 'Miércoles') {
          return 3;
        } else if (dia === 'Jueves') {
          return 4;
        } else if (dia === 'Viernes') {
          return 5;
        } else if (dia === 'Sábado') {
          return 6;
        }
        else{return -1}
      });
      return dias.includes(diaSemana);
    });

    if (horario === undefined) {
      // Pasa el dia de la semana a español
      let diaString = '';
      if (diaSemana === 0) {
        diaString = 'Domingo';
      } else if (diaSemana === 1) {
        diaString = 'Lunes';
      } else if (diaSemana === 2) {
        diaString = 'Martes';
      } else if (diaSemana === 3) {
        diaString = 'Miércoles';
      } else if (diaSemana === 4) {
        diaString = 'Jueves';
      } else if (diaSemana === 5) {
        diaString = 'Viernes';
      } else if (diaSemana === 6) {
        diaString = 'Sábado';
      }
      this.dialog.open(DialogHomeComponent, {
        width: '400px',
        data: {
          err: `El restaurante no abre el ${diaString}`,
        },
      });

      return;
    }
    const horaApertura = horario.horas[0];
    const horaCierre = horario.horas[1];
    const horaReserva = this.reservasGroup.controls['hora'].value;
    if (
      (horaApertura > horaCierre &&
        (horaReserva < horaApertura && horaReserva > horaCierre)) ||
      (horaApertura < horaCierre &&
        (horaReserva < horaApertura || horaReserva > horaCierre))
    ) {
      this.dialog.open(DialogHomeComponent, {
        width: '400px',
        data: {
          err: `El restaurante no abre a las ${this.reservasGroup.controls['hora'].value}`,
        },
      });

      return;
    }

    const reserva = {
      uidUsuario: this.usuario._id,
      uidRestaurante: this.restaurante._id,
      uidReserva: this.generarNumeroUnico(),
      fecha: date,
      hora: this.reservasGroup.controls['hora'].value,
      personas: this.reservasGroup.controls['personas'].value,
    };
    this.restaurante.reservas.push(reserva);
    this.restaurante.vecesReservado++;
    this.authService.editarRestaurante(this.restaurante).subscribe((resp) => {
      this.usuario.reservas.push(reserva);
      this.authService.editaUsuario(this.usuario).subscribe((resp) => {
        this.dialog.open(DialogHomeComponent, {
          width: '400px',
          data: {
            err: `¡Reserva realizada con éxito!`,
          },
        });
      });


    });
  }

  getNumeroPersonasPorHora(horaIntervalo: string) {
    const horas = this.restaurante.reservas.map((reserva: any) => {
      return {
        horaReserva: reserva.hora.slice(0, -2) + '00',
        personas: reserva.personas,
      };
    });
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
