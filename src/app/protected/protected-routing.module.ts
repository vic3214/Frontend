import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenGuard } from '../auth/guards/validar-token.guard';
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
      { path: 'restaurante', component: DashboardRestauranteComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedRoutingModule {}
