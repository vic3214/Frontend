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
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  openDialog(err: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
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
        console.log(resp); // Datos para el inicio de la sesión
        if (resp) {
          this.router.navigateByUrl('/dashboard');
        } else {
        }
      },
      (err) => {
        let erroresEnviar: any = [];
        Object.entries(err.error.errores).forEach(([key, value]) => {
          erroresEnviar.push(value);
        });
        this.openDialog(erroresEnviar);
      }
    );
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.html',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
