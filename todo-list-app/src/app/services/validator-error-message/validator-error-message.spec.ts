import { TestBed } from '@angular/core/testing';

import { ValidatorErrorMessage } from './validator-error-message';

describe('ValidatorErrorMessage', () => {
  let service: ValidatorErrorMessage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorErrorMessage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
