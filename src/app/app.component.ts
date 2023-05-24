import { Component } from '@angular/core';
import { TestStateTiny } from './tiny-state/test-state.tiny';
import { TinySelect } from './tiny-state/tiny-state.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @TinySelect(TestStateTiny.get)
  public state;

  constructor() {}

  ngOnInit() {
    console.log(this.state.getValue());
  }
}
