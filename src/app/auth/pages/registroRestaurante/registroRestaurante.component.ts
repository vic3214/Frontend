import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registroRestaurante.component.html',
  styleUrls: ['./registroRestaurante.component.css'],
})
export class RegistroRestauranteComponent {
  hide: boolean = true;
  hideRepetida: boolean = true;
  options = ['Entrante', 'Primero', 'Segundo', 'Postre', 'Bebida'];
  dias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private date: DateAdapter<Date>,
    private authService: AuthService,
    private router: Router
  ) {
    // Ponemos en los calendarios el lunes como primer día
    date.getFirstDayOfWeek = () => 1;
  }

  datosPersonales: FormGroup = this._formBuilder.group({
    nombrePropietario: [],
    fechaNacimiento: [],
  });
  datosRestaurante: FormGroup = this._formBuilder.group({
    nombre: [],
    ciudad: [],
    calle: [],
    numero: [],
    fotografia: [''],
    tematica: [],
    horario: this._formBuilder.array([
      this._formBuilder.group({
        dias: [[]],
        horas: this._formBuilder.array([
          this._formBuilder.control(null),
          this._formBuilder.control(null),
        ]),
      }),
    ]),
  });
  carta: FormGroup = this._formBuilder.group({
    platos: this._formBuilder.array([
      this._formBuilder.group({
        nombrePlato: [],
        precio: [],
        tipo: [],
      }),
    ]),
  });

  inicioSesion: FormGroup = this._formBuilder.group({
    email: new FormControl(
      [],
      [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}'),
      ]
    ),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    passwordRepetida: [],
  });

  get horarios(): FormArray {
    return this.datosRestaurante.get('horario') as FormArray;
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
  get password() {
    return this.inicioSesion.get('password');
  }
  get email() {
    return this.inicioSesion.get('email');
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

  get getPlatos() {
    return this.carta.get('platos') as FormArray;
  }

  async creaRestaurante() {
    if (
      this.datosPersonales.valid &&
      this.inicioSesion.valid &&
      this.datosRestaurante.valid &&
      this.carta.valid
    ) {
      (
        await this.authService.registraRestaurante(
          this.datosPersonales,
          this.datosRestaurante,
          this.carta,
          this.inicioSesion
        )
      ).subscribe((resp) => {
        this.router.navigateByUrl('auth/loginRestaurante');
      });
    }
  }
}
