import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { TestStateTiny } from '../tiny-state/test-state.tiny';
import { TinySelect } from '../tiny-state/tiny-state.service';

@Component({
  selector: 'app-hello-ketto',
  templateUrl: './hello-ketto.component.html',
  styleUrls: ['./hello-ketto.component.css']
})
export class HelloKettoComponent implements OnInit {
  @ViewChild('input') public input: NgModel;

  @TinySelect(TestStateTiny.get)
  public state;

  @TinySelect(TestStateTiny.foo)
  public foo;

  constructor() {}

  ngOnInit() {}

  public setValue($event) {
    this.state = this.input.value;
  }
}
