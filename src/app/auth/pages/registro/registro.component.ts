import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
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
    private authService: AuthService,
    private router: Router
  ) {
    // Ponemos en los calendarios el lunes como primer día
    date.getFirstDayOfWeek = () => 1;
  }
  datosPersonales: FormGroup = this._formBuilder.group({
    nombre: [],
    fechaNacimiento: [],
    fotografia: [''], // Validar contenido fichero 80000kb
  });

  inicioSesion: FormGroup = this._formBuilder.group({
    email: [],
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    passwordRepetida: ['', this.checkEqualsPasswords()],
  });

  checkEqualsPasswords(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.get('password') === control.get('passwordRepetida')
        ? { password: true }
        : null;
    };
  }
  get password() {
    return this.inicioSesion.get('password');
  }
  get passwordRepetida() {
    return this.inicioSesion.get('passwordRepetida');
  }

  get email() {
    return this.inicioSesion.get('email');
  }
  uploadFile(e: any) {
    console.log(e);
    const maxSize = 80000;
    if (e.srcElement.files[0] && e.srcElement.files[0].size <= maxSize) {
      this.datosPersonales.controls['fotografia'].setValue(
        e.srcElement.files[0]
      );
    } else {
      console.log('Archivo muy pesado');
    }

    console.log(this.datosPersonales.controls['fotografia'].value);
  }

  async creaUsuario() {
    if (this.datosPersonales.valid && this.inicioSesion.valid) {
      (
        await this.authService.registraUsuario(
          this.datosPersonales,
          this.inicioSesion
        )
      ).subscribe((resp) => {
        this.router.navigateByUrl('auth/login');
      });
    }
  }
}
