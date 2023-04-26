import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { MaterialModule } from '../material/material.module';
import {
  ComentarioAnnotatedComponent,
  DialogHomeComponent,
  HomeComponent,
} from './home/home.component';

@NgModule({
  declarations: [
    HomeComponent,
    DialogHomeComponent,
    ComentarioAnnotatedComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    MatCardModule,
    MaterialModule,
  ],
  exports: [HomeComponent],
})
export class ComponentsModule {}
