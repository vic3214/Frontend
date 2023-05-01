import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ComentarioAnnotatedComponent } from 'src/app/components/home/home.component';

@Component({
  selector: 'app-dashboard-restaurante',
  templateUrl: './dashboard-restaurante.component.html',
  styleUrls: ['./dashboard-restaurante.component.css'],
})
export class DashboardRestauranteComponent implements OnInit {
  editar: Boolean = false;
  reservas: Boolean = true;
  reservasRestaurante: any[] = [];
  restaurante: any = {};
  dias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
    'Festivos',
  ];
  options = ['Entrante', 'Primero', 'Segundo', 'Postre', 'Bebida'];

  horario: FormGroup = this._formBuilder.group({
    horario: this._formBuilder.array([
      this._formBuilder.group({
        dias: [[]],
        horas: this._formBuilder.array([
          this._formBuilder.control(''),
          this._formBuilder.control(''),
        ]),
      }),
    ]),
  });

  carta: FormGroup = this._formBuilder.group({
    tematica: [],
    platos: this._formBuilder.array([
      this._formBuilder.group({
        nombrePlato: [],
        precio: [],
        tipo: [],
      }),
    ]),
  });

  hide: boolean = true;
  hideRepetida: boolean = true;

  ngOnInit(): void {
    if (
      localStorage.getItem('token-restaurante') &&
      this.authService.validarRestauranteToken()
    ) {
      this.authService.obtenerDatosRestauranteToken().subscribe((res: any) => {
        this.restaurante = res.restaurante;
        this.reservasRestaurante = res.restaurante.reservas;

        let horarios: any[] = [];

        for (let i = 0; i < this.restaurante.horario.length; i++) {
          const formBuilder = this._formBuilder.group({
            dias: this._formBuilder.control(this.restaurante.horario[i].dias),
            horas: this._formBuilder.array([
              this._formBuilder.control(this.restaurante.horario[i].horas[0]),
              this._formBuilder.control(this.restaurante.horario[i].horas[1]),
            ]),
          });
          horarios.push(formBuilder);
        }

        this.horario = this._formBuilder.group({
          horario: this._formBuilder.array(horarios),
        });

        let platos: any[] = [];

        const categorias = [
          this.restaurante.carta.bebidas,
          this.restaurante.carta.entrantes,
          this.restaurante.carta.primerosPlatos,
          this.restaurante.carta.segundosPlatos,
          this.restaurante.carta.postres,
        ];

        for (let categoria of categorias) {
          for (let i = 0; i < categoria.length; i++) {
            const formCarta = this._formBuilder.group({
              nombrePlato: this._formBuilder.control(categoria[i].nombrePlato),
              precio: this._formBuilder.control(categoria[i].precio),
              tipo: this._formBuilder.control(categoria[i].tipo),
            });
            platos.push(formCarta);
          }
        }

        this.carta = this._formBuilder.group({
          tematica: [this.restaurante.tematica],
          platos: this._formBuilder.array(platos),
        });
      });
    } else if (!this.authService.validarRestauranteToken()) {
      this.router.navigateByUrl('auth/loginRestaurante');
    }
  }

  get getPlatos() {
    return this.carta.get('platos') as FormArray;
  }

  get horarios(): FormArray {
    return this.horario.get('horario') as FormArray;
  }

  get email() {
    return this.inicioSesion.get('email');
  }

  get password() {
    return this.inicioSesion.get('password');
  }

  agregarHorario() {
    this.horarios.push(
      this._formBuilder.group({
        dias: [[]],
        horas: this._formBuilder.array([
          this._formBuilder.control(null),
          this._formBuilder.control(null),
        ]),
      })
    );
  }

  agregarPlato() {
    const control = <FormArray>this.carta.controls['platos'];
    control.push(
      this._formBuilder.group({ nombrePlato: [], precio: [], tipo: [] })
    );
  }

  eliminarPlato(index: number) {
    const control = <FormArray>this.carta.controls['platos'];
    control.removeAt(index);
  }

  inicioSesion: FormGroup = this._formBuilder.group({
    email: [''],
    password: [''],
    passwordRepetida: [''],
  });

  get getRestaurante() {
    return this.restaurante;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

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

  eliminarHorario(index: number) {
    const control = <FormArray>this.horario.controls['horario'];
    control.removeAt(index);
  }

  cambiarInicioSesion() {
    if (
      this.inicioSesion.valid &&
      this.inicioSesion.controls['password'].value ===
        this.inicioSesion.controls['passwordRepetida'].value
    ) {
      console.log('Cambio');
      console.log(this.restaurante);
      this.restaurante.email = this.inicioSesion.controls['email'].value;
      this.restaurante.password = this.inicioSesion.controls['password'].value;
      console.log(this.restaurante);
      this.authService
        .cambiaPasswordRestaurante(this.restaurante)
        .subscribe((resp) => {
          console.log('respuesta', resp);
          if (resp.ok) {
            this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
              duration: 3 * 500,
              panelClass: ['snackBar'],
              data: {
                mensaje: 'Datos editados correctamente',
              },
            });
          } else {
            this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
              duration: 3 * 500,
              panelClass: ['snackBar'],
              data: {
                mensaje: resp.msg,
              },
            });
          }
        });
    } else if (
      this.inicioSesion.controls['password'].value !==
      this.inicioSesion.controls['passwordRepetida'].value
    ) {
      this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
        duration: 3 * 500,
        panelClass: ['snackBar'],
        data: {
          mensaje: 'Las contraseñas no son iguales',
        },
      });
    } else {
      this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
        duration: 3 * 500,
        panelClass: ['snackBar'],
        data: {
          mensaje: '¡Debes rellenar el formulario correctamente!',
        },
      });
    }
  }

  editarHorario() {
    if (this.horario.valid) {
      console.log(this.restaurante);
      this.restaurante.horario = this.horario.controls['horario'].value;
      this.authService
        .editarRestaurante(this.restaurante)
        .subscribe((resp) => {});
    } else {
      this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
        duration: 3 * 500,
        panelClass: ['snackBar'],
        data: {
          mensaje: '¡Debes rellenar el formulario correctamente!',
        },
      });
    }
  }

  guardarCarta() {
    if (this.carta.valid) {
      const bodyCarta = this.authService.construyeCarta(this.carta);
      this.restaurante.carta = bodyCarta;
      this.authService
        .editarRestaurante(this.restaurante)
        .subscribe((resp) => {});
    } else {
      this._snackBar.openFromComponent(ComentarioAnnotatedComponent, {
        duration: 3 * 500,
        panelClass: ['snackBar'],
        data: {
          mensaje: '¡Debes rellenar el formulario correctamente!',
        },
      });
    }
  }

  eliminaCuenta() {}
}
