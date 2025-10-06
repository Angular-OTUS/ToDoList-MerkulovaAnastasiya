import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListItem } from './todo-list-item';

describe('TodoListItem', () => {
  let component: TodoListItem;
  let fixture: ComponentFixture<TodoListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListItem],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoListItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
