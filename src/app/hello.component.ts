import { Component, Input } from '@angular/core';
import { TestStateTiny } from './tiny-state/test-state.tiny';
import { TinySelect } from './tiny-state/tiny-state.service';

@Component({
  selector: 'hello',
  template: `
    <h1>Hello {{ state | async | json }}!</h1>
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
    `
  ]
})
export class HelloComponent {
  @Input() name: string;
  @TinySelect(TestStateTiny.get)
  public state;
}
