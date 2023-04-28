import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ComentarioAnnotatedComponent } from 'src/app/components/home/home.component';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-restaurante',
  templateUrl: './restaurante.component.html',
  styleUrls: ['./restaurante.component.css'],
})
export class RestauranteComponent implements OnInit {
  minDate = new Date();
  id: string = '';
  restaurante: any;
  valoracion: number = 0;
  numeroValoraciones: number = 0;
  durationInSeconds = 5;
  usuario: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private searchService: SearchService,
    private _formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  //TODO: Poder valorar el restaurante y añadir icono estrella
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

      console.log('Restaurante cargado:', res.restaurante);
    });
    this.authService.obtenerDatosToken().subscribe((res: any) => {
      this.searchService.getUsuarioPorId(res.uid).subscribe((res: any) => {
        console.log('resusuario', res.usuario);
        this.usuario = res.usuario;
      });
    });
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
  reservar() {
    if (this.reservasGroup.valid && localStorage.getItem('token') != null) {
      const reserva: any = {
        usuario: this.reservasGroup.controls['nombre'].value,
        personas: this.reservasGroup.controls['personas'].value,
        hora: this.reservasGroup.controls['hora'].value,
        fecha: this.reservasGroup.controls['fecha'].value,
      };
      this.restaurante.reservas.push(reserva);
      this.authService.editarRestaurante(this.restaurante).subscribe((resp) => {
        console.log('Res EDitar', resp.restaurante);
        console.log('Reservas', resp.restaurante.reservas.slice(-1)[0]._id);
        reserva['uidReserva'] = resp.restaurante.reservas.slice(-1)[0]._id;
        reserva['uidRestaurante'] = resp.restaurante._id;
        console.log(reserva);
        this.usuario.reservas.push(reserva);
        this.authService.editaUsuario(this.usuario).subscribe((res: any) => {
          console.log('Respuesta', res);
        });
      });

      //TODO: Lanzar algo reserva exitosa o reserva fallida
      this.openSnackBar('¡Reserva realizada con éxito!');
    } else {
      this.openSnackBar('¡Debes iniciar sesión para hacer una reserva!');
    }
  }
}
