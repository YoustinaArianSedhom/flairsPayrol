import { TestBed } from '@angular/core/testing';

import { RaisesService } from './raises.service';

describe('RaisesService', () => {
  let service: RaisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
