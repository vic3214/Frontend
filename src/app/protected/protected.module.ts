import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProtectedRoutingModule } from './protected-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, ProtectedRoutingModule],
})
export class ProtectedModule {}
