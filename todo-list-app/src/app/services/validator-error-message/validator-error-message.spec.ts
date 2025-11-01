import { TestBed } from '@angular/core/testing';

import { ValidatorErrMessageService } from './validator-error-message';

describe('ValidatorErrMessageService', () => {
  let service: ValidatorErrMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorErrMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
