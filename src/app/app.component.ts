import { Component } from '@angular/core';
import { TinySelect } from '@i-cell/tiny-state';
import { TestStateTiny } from './tiny-state/test-state.tiny';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @TinySelect(TestStateTiny.get)
  public state;

  constructor() {}

  ngOnInit() {}
}
