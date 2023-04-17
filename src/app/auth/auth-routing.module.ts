import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoginRestauranteComponent } from './pages/loginRestaurante/loginRestaurante.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RegistroRestauranteComponent } from './pages/registroRestaurante/registroRestaurante.component';
import { RestauranteComponent } from './pages/restaurante/restaurante.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'registro',
        component: RegistroComponent,
      },
      {
        path: 'registroRestaurante',
        component: RegistroRestauranteComponent,
      },
      {
        path: 'loginRestaurante',
        component: LoginRestauranteComponent,
      },
      {
        path: 'restaurante/:id',
        component: RestauranteComponent,
      },
      {
        path: '**',
        redirectTo: 'error', // TODO configurar pagina de error
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
