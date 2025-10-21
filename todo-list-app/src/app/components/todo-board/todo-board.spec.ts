import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoBoard } from './todo-board';

describe('TodoBoard', () => {
  let component: TodoBoard;
  let fixture: ComponentFixture<TodoBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
