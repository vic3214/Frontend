import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
@NgModule({
  exports: [MatToolbarModule, MatIconModule, MatListModule, MatSidenavModule],
})
export class MaterialModule {}
