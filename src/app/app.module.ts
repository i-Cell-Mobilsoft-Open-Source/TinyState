import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TinyStateModule } from '@i-cell/tiny-state';
import { AppComponent } from './app.component';
import { HelloKettoComponent } from './hello-ketto/hello-ketto.component';
import { HelloComponent } from './hello.component';

@NgModule({
  imports: [BrowserModule, FormsModule, TinyStateModule],
  declarations: [AppComponent, HelloComponent, HelloKettoComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
