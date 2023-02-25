import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, AuthRoutingModule, FormsModule, MatCardModule],
  exports: [HomeComponent],
})
export class ComponentsModule {}
