import { NgModule } from '@angular/core';
import { TinyStateService } from './tiny-state.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [TinyStateService],
})
export class TinyStateModule {
  constructor(private tss: TinyStateService) {}
}
