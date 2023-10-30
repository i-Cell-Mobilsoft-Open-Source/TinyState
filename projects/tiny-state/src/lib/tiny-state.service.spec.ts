import { TestBed } from '@angular/core/testing';

import { TinyStateService } from './tiny-state.service';

describe('TinyStateService', () => {
  let service: TinyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TinyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
