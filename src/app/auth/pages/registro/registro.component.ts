import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  hide: boolean = true;
  hideRepetida: boolean = true;
  constructor(private _formBuilder: FormBuilder) {}
  datosPersonales: FormGroup = this._formBuilder.group({
    nombre: [''],
    fechaNacimiento: [''],
    fotografia: [''],
  });
  inicioSesion: FormGroup = this._formBuilder.group({
    email: [''],
    password: [''],
    passwordRepetida: [''],
  });
}
