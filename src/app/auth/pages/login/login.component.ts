import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  registrarUsuario: Boolean = false;
  hide: Boolean = true;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  submited = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  login() {
    console.log('Iniciando sesion...');
    this.authService.login(this.loginForm.value).subscribe(
      (resp) => {
        console.log(resp);
      },
      (err) => {
        //TODO: Personalizar error
        console.log('Error');
      }
    );
  }
}
