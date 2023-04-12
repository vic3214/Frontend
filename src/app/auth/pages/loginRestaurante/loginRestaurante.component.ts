import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loginRestaurante',
  templateUrl: './loginRestaurante.component.html',
  styleUrls: ['./loginRestaurante.component.css'],
})
export class LoginRestauranteComponent {
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
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  openDialog(err: any): void {
    const dialogRef = this.dialog.open(DialogRestauranteComponent, {
      width: '300px',
      data: { err: err },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  login() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe(
      (resp) => {
        //TODO Abrir página de login con datos del usuario
        //* Recuperar objeto base de datos y cargar página según datos
        console.log(resp);
        if (resp) {
          this.router.navigateByUrl('/dashboard');
        }
      },
      (err) => {
        let erroresEnviar: any = [];
        let formErrors = err.error.errores === undefined;
        if (!formErrors) {
          // Errores al checkear si estan vacios email, contraseña y si el email está bien formado
          Object.entries(err.error.errores).forEach(([key, value]) => {
            console.log(value);
            erroresEnviar.push(value);
          });
        } else {
          // Errores del backend: pj usuario o contraseña incorrectos
          erroresEnviar.push(err.error);
        }
        this.openDialog(erroresEnviar);
      }
    );
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialogRestaurante.html',
})
export class DialogRestauranteComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogRestauranteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
