import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { MaterialModule } from '../material/material.module';
import { CartaChartComponent } from './carta-chart/carta-chart.component';
import {
  ComentarioAnnotatedComponent,
  DialogHomeComponent,
  HomeComponent,
} from './home/home.component';
import { HorasChartComponent } from './horas-chart/horas-chart.component';
import { ReservasChartComponent } from './reservas-chart/reservas-chart.component';
import { VisitadosChartComponent } from './visitados-chart/visitados-chart.component';

@NgModule({
  declarations: [
    HomeComponent,
    DialogHomeComponent,
    ComentarioAnnotatedComponent,
    ReservasChartComponent,
    VisitadosChartComponent,
    CartaChartComponent,
    HorasChartComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    HomeComponent,
    ReservasChartComponent,
    VisitadosChartComponent,
    CartaChartComponent,
    HorasChartComponent,
  ],
})
export class ComponentsModule {}
