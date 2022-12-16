import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  hide: boolean = true;
  hideRepetida: boolean = true;
  constructor(
    private _formBuilder: FormBuilder,
    private date: DateAdapter<Date>,
    private authService: AuthService
  ) {
    // Ponemos en los calendarios el lunes como primer día
    date.getFirstDayOfWeek = () => 1;
  }
  datosPersonales: FormGroup = this._formBuilder.group({
    nombre: [''],
    fechaNacimiento: [],
    fotografia: [''],
  });

  inicioSesion: FormGroup = this._formBuilder.group({
    email: [''],
    password: [''],
    passwordRepetida: [''],
  });

  creaUsuario() {
    // 0: Domingo, 1: Lunes ...
    /*     console.log(
      this.datosPersonales.controls['fechaNacimiento'].value.getDay()
    ); */
    this.authService.registraUsuario(this.datosPersonales, this.inicioSesion);
  }
}
