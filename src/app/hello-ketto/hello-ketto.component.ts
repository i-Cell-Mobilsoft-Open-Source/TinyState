import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { TinySelect } from '@i-cell/tiny-state';
import { TestStateTiny } from '../tiny-state/test-state.tiny';
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
