import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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
  durationInSeconds = 5;
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
      console.log('Restaurante cargado:', res.restaurante);
    });
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

  addComentario() {
    const comentario = this.comentarioGroup.get('comentario')!.value;
    if (localStorage.getItem('token') === null) {
      this.openSnackBar('¡Debes iniciar sesión para comentar!');
    } else if (comentario.length > 0 && comentario.trim() > 0) {
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
      const reserva = {
        usuario: this.reservasGroup.controls['nombre'].value,
        personas: this.reservasGroup.controls['personas'].value,
        hora: this.reservasGroup.controls['hora'].value,
        fecha: this.reservasGroup.controls['fecha'].value,
      };
      this.restaurante.reservas.push(reserva);
      this.authService
        .editarRestaurante(this.restaurante)
        .subscribe((resp) => {});
      //TODO: Lanzar algo reserva exitosa o reserva fallida
      this.openSnackBar('¡Reserva realizada con éxito!');
    } else {
      this.openSnackBar('¡Debes iniciar sesión para hacer una reserva!');
    }
  }
}

@Component({
  selector: 'snack-bar-annotated-component-example-snack',
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
