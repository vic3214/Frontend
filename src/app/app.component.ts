import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Frontend';
  get usuario() {
    return this.authService.usuario;
  }
  constructor(private authService: AuthService) {}

  compruebaToken() {
    let estaToken = true;
    console.log('Token: ', localStorage.getItem('token'));
    if (localStorage.getItem('token') === undefined) {
      estaToken = false;
    }
    return estaToken;
  }
}
