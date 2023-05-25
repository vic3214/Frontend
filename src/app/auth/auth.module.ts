import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from '../material/material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { DialogComponent, LoginComponent } from './pages/login/login.component';
import {
  DialogRestauranteComponent,
  LoginRestauranteComponent,
} from './pages/loginRestaurante/loginRestaurante.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RegistroRestauranteComponent } from './pages/registroRestaurante/registroRestaurante.component';
import { RestauranteComponent } from './pages/restaurante/restaurante.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    DialogComponent,
    LoginRestauranteComponent,
    DialogRestauranteComponent,
    RegistroRestauranteComponent,
    RestauranteComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MaterialModule,
  ],
})
export class AuthModule {}
