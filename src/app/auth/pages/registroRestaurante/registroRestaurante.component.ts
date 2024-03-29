import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registroRestaurante.component.html',
  styleUrls: ['./registroRestaurante.component.css'],
})
export class RegistroRestauranteComponent {
  hide = true;
  hideRepetida = true;
  options = ['Entrante', 'Primero', 'Segundo', 'Postre', 'Bebida'];
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
    codigoPostal: [],
    fotografia: [''],
    tematica: [],
    maxPersonas: [],
    maxReservas: [],
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
        fotografiaPlato: [''],
        descripcion: [],
        alergenos: [[]],
      }),
    ]),
  });
  checkFileSize(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value instanceof File) {
        return value.size > 80000 ? { fileSize: true } : null;
      } else if (typeof value === 'string') {
        return value === '' ? null : { fileSize: true };
      }
      return null;
    };
  }
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
    passwordRepetida: [['']],
  });

  get passwordRepetida() {
    return this.inicioSesion.get('passwordRepetida');
  }

  get horarios(): FormArray {
    return this.datosRestaurante.get('horario') as FormArray;
  }

  uploadFile(e: any, form: string, i: number) {
    console.log(e);
    const maxSize = 80000;
    if (form === 'restaurante') {
      if (e.srcElement.files[0] && e.srcElement.files[0].size <= maxSize) {
        this.datosRestaurante.controls['fotografia'].setValue(
          e.srcElement.files[0]
        );
      } else {
        console.log('Archivo muy pesado');
      }
    } else {
      if (e.srcElement.files[0] && e.srcElement.files[0].size <= maxSize) {
        const platosArray = this.carta.get('platos') as FormArray;
        platosArray
          .at(i)
          .get('fotografiaPlato')!
          .setValue(e.srcElement.files[0]);
      } else {
        console.log('Archivo muy pesado');
      }
    }
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
      this._formBuilder.group({
        nombrePlato: [],
        precio: [],
        tipo: [],
        fotografiaPlato: [],
        descripcion: [],
        alergenos: [[]],
      })
    );
  }

  eliminarPlato(index: number) {
    const control = <FormArray>this.carta.controls['platos'];
    control.removeAt(index);
  }

  eliminarHorario(index: number) {
    const control = <FormArray>this.datosRestaurante.controls['horario'];
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
      ).subscribe((res) => {
        console.log('res', res);
        this.router.navigateByUrl('auth/loginRestaurante');
      });
    }
  }
}
