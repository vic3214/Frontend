import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ValidarTokenRestauranteGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authService.validarTokenRestaurante('token-restaurante').pipe(
      tap((valid) => {
        if (!valid) {
          this.router.navigateByUrl('/auth/loginRestaurante');
        }
      })
    );
  }

  canLoad(): Observable<boolean> | boolean {
    return this.authService.validarTokenRestaurante('token-restaurante').pipe(
      tap((valid) => {
        if (!valid) {
          this.router.navigateByUrl('/auth/loginRestaurante');
        }
      })
    );
  }
}
