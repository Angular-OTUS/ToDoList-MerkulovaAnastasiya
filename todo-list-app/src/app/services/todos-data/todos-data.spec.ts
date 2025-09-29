import { TestBed } from '@angular/core/testing';

import { TodosDataService } from './todos-data';

describe('TodosData', () => {
  let service: TodosDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodosDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
