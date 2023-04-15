import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardRestauranteComponent } from './dashboard-restaurante/dashboard-restaurante.component';

@NgModule({
  declarations: [DashboardComponent, DashboardRestauranteComponent],
  imports: [CommonModule, ProtectedRoutingModule, MaterialModule],
})
export class ProtectedModule {}
