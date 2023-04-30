import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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

  ngOnInit(): void {
    console.log('horariosIni', this.horario);
    if (
      localStorage.getItem('token-restaurante') &&
      this.authService.validarRestauranteToken()
    ) {
      this.authService.obtenerDatosRestauranteToken().subscribe((res: any) => {
        this.restaurante = res.restaurante;
        this.reservasRestaurante = res.restaurante.reservas;
        console.log('reservas', this.reservasRestaurante);
        console.log('restaurante', this.restaurante);

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
        console.log('horario', this.horario);

        let platos: any[] = [];

        for (let i = 0; i < this.restaurante.carta.bebidas.length; i++) {
          const formCarta = this._formBuilder.group({
            nombrePlato: this._formBuilder.control(
              this.restaurante.carta.bebidas[i].nombrePlato
            ),
            precio: this._formBuilder.control(
              this.restaurante.carta.bebidas[i].precio
            ),
            tipo: this._formBuilder.control(
              this.restaurante.carta.bebidas[i].tipo
            ),
          });
          platos.push(formCarta);
        }
        for (let i = 0; i < this.restaurante.carta.entrantes.length; i++) {
          const formCarta = this._formBuilder.group({
            nombrePlato: this._formBuilder.control(
              this.restaurante.carta.entrantes[i].nombrePlato
            ),
            precio: this._formBuilder.control(
              this.restaurante.carta.entrantes[i].precio
            ),
            tipo: this._formBuilder.control(
              this.restaurante.carta.entrantes[i].tipo
            ),
          });
          platos.push(formCarta);
        }
        for (let i = 0; i < this.restaurante.carta.primerosPlatos.length; i++) {
          const formCarta = this._formBuilder.group({
            nombrePlato: this._formBuilder.control(
              this.restaurante.carta.primerosPlatos[i].nombrePlato
            ),
            precio: this._formBuilder.control(
              this.restaurante.carta.primerosPlatos[i].precio
            ),
            tipo: this._formBuilder.control(
              this.restaurante.carta.primerosPlatos[i].tipo
            ),
          });
          platos.push(formCarta);
        }
        for (let i = 0; i < this.restaurante.carta.segundosPlatos.length; i++) {
          const formCarta = this._formBuilder.group({
            nombrePlato: this._formBuilder.control(
              this.restaurante.carta.segundosPlatos[i].nombrePlato
            ),
            precio: this._formBuilder.control(
              this.restaurante.carta.segundosPlatos[i].precio
            ),
            tipo: this._formBuilder.control(
              this.restaurante.carta.segundosPlatos[i].tipo
            ),
          });
          platos.push(formCarta);
        }
        for (let i = 0; i < this.restaurante.carta.postres.length; i++) {
          const formCarta = this._formBuilder.group({
            nombrePlato: this._formBuilder.control(
              this.restaurante.carta.postres[i].nombrePlato
            ),
            precio: this._formBuilder.control(
              this.restaurante.carta.postres[i].precio
            ),
            tipo: this._formBuilder.control(
              this.restaurante.carta.postres[i].tipo
            ),
          });
          platos.push(formCarta);
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
    nombre: [],
    correo: [],
    password: [],
  });

  get getRestaurante() {
    return this.restaurante;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private _formBuilder: FormBuilder
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

  cambiarInicioSesion() {}

  editarHorario() {}
}
