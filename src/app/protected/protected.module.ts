import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../material/material.module';
import { FormateoFechasPipe } from '../pipes/formateo-fechas.pipe';
import { DashboardRestauranteComponent } from './dashboard-restaurante/dashboard-restaurante.component';
import {
  DashboardComponent,
  DialogOverviewExampleDialog,
} from './dashboard/dashboard.component';
import { ProtectedRoutingModule } from './protected-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardRestauranteComponent,
    FormateoFechasPipe,
    DialogOverviewExampleDialog,
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
})
export class ProtectedModule {}
