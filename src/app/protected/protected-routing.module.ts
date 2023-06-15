import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenRestauranteGuard } from '../guards/validar-token-restaurante.guard';
import { ValidarTokenGuard } from '../guards/validar-token.guard';
import { DashboardRestauranteComponent } from './dashboard-restaurante/dashboard-restaurante.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuario',
        component: DashboardComponent,
        canActivate: [ValidarTokenGuard],
        canLoad: [ValidarTokenGuard],
      },
      { path: 'restaurante', component: DashboardRestauranteComponent,
      canActivate: [ValidarTokenRestauranteGuard],
      canLoad: [ValidarTokenRestauranteGuard],},
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedRoutingModule {}
