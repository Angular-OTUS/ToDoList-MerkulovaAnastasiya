import { TestBed } from '@angular/core/testing';

import { TodosApi } from './todos-api';

describe('TodosApi', () => {
  let service: TodosApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodosApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
