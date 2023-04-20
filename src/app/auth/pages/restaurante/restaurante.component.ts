import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
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
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';

    this.searchService.getRestaurantePorId(this.id).subscribe((res: any) => {
      this.restaurante = res.restaurante;
      console.log('Restaurante cargado:', res.restaurante);
    });
  }

  reservasGroup: FormGroup = this._formBuilder.group({
    nombre: '',
    fecha: '',
    hora: '',
    personas: '',
  });

  comentarioGroup: FormGroup = this._formBuilder.group({
    comentario: ['', Validators.required],
  });

  addComentario() {
    const comentario = this.comentarioGroup.get('comentario')!.value;
    if (localStorage.getItem('token') === null) {
      console.log('Debes iniciar sesion para comentar');
    } else if (comentario != '') {
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
      this.openSnackBar();
      console.log('Comentario vacio, no se añade');
    }
  }
  openSnackBar() {
    this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
      duration: this.durationInSeconds * 1000,
      panelClass: ['snackBar'],
    });
  }

  // TODO: Hacer reservas
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
}
