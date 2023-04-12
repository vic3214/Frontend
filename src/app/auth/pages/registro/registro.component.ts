import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { FileValidator } from 'ngx-material-file-input';
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
    fotografia: ['', [FileValidator.maxContentSize(20000)]],
  });

  inicioSesion: FormGroup = this._formBuilder.group({
    email: [],
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    passwordRepetida: [],
  });

  get password() {
    return this.inicioSesion.get('password');
  }

  get email() {
    return this.inicioSesion.get('email');
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
