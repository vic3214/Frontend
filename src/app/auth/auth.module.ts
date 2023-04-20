import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../material/material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { DialogComponent, LoginComponent } from './pages/login/login.component';
import {
  DialogRestauranteComponent,
  LoginRestauranteComponent,
} from './pages/loginRestaurante/loginRestaurante.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RegistroRestauranteComponent } from './pages/registroRestaurante/registroRestaurante.component';
import {
  ComentarioAnnotatedComponent,
  RestauranteComponent,
} from './pages/restaurante/restaurante.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent,
    DialogComponent,
    LoginRestauranteComponent,
    DialogRestauranteComponent,
    RegistroRestauranteComponent,
    RestauranteComponent,
    ComentarioAnnotatedComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ComponentsModule,
    MaterialModule,
    MaterialFileInputModule,
  ],
})
export class AuthModule {}
