import { TestBed } from '@angular/core/testing';

import { TodosData } from './todos-data';

describe('TodosData', () => {
  let service: TodosData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodosData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
