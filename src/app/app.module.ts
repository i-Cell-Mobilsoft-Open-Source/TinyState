import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TinyStateService } from './tiny-state/tiny-state.service';
import { TestStateTiny } from './tiny-state/test-state.tiny';
import { HelloKettoComponent } from './hello-ketto/hello-ketto.component';

export let AppInjector;

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, HelloComponent, HelloKettoComponent],
  bootstrap: [AppComponent],
  providers: [TinyStateService]
})
export class AppModule {
  constructor(public injector: Injector) {
    AppInjector = injector;
  }
}
