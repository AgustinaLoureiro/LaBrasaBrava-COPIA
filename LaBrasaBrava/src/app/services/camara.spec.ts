import { TestBed } from '@angular/core/testing';
import { Camara } from './camara';

describe('Camara', () => {
  let service: Camara;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Camara);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
