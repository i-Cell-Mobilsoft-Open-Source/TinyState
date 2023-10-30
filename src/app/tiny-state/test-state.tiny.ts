import { TinyHandler, TinySelector } from "@i-cell/tiny-state";

@TinyHandler<{ test: string; customer: { name: string } }>()
export class TestStateTiny {
  public initialState: any = {
    test: 'ad',
    customer: {
      name: 'Lutz Gizi'
    }
  };

  constructor() {}

  @TinySelector('test')
  public static get(value) {
    return value;
  }

  @TinySelector('customer.name')
  public static foo(value) {
    return value;
  }
}
