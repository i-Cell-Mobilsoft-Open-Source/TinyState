import { Component, Input } from '@angular/core';
import { TinySelect } from '@i-cell/tiny-state';
import { TestStateTiny } from './tiny-state/test-state.tiny';

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
