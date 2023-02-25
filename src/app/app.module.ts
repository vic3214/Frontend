import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { ComponentsModule } from './components/components.module';
import { SharedComponent } from './shared/shared.component';
@NgModule({
  declarations: [AppComponent, AuthComponent, SharedComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ComponentsModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatIconModule,
    LeafletModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
