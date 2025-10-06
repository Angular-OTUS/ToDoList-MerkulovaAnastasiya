import { Injectable } from '@angular/core';
import { AddTodoDto, EditTodoDto } from '../../shared/types/dto/todo.dto';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { TODO_STATUS } from '../../shared/util/constants';
import { INITIAL_TODOS } from './todo-list.config';

@Injectable({
  providedIn: 'root',
})
export class TodosDataService {
  private todos: ITodoItem[] = INITIAL_TODOS;

  public addNewTodo(newTodo: AddTodoDto): void {
    this.todos = [...this.todos, { ...newTodo, id: `${this.todos.length+1}`, status:TODO_STATUS.INPROGRESS }];
  }

  public editTodo(todo: EditTodoDto): void {
    this.todos[this.todos.findIndex((item) => item.id === todo.id)] = todo;
  }

  public removeTodo(id: string): void {
    this.todos = [...this.todos.filter((todo) => todo.id !== id)];
  }

  public getTodoById(id: string): ITodoItem | undefined {
    return this.todos.find((item) => item.id === id);
  }

  public getAllTodos(): ITodoItem[] {
    return this.todos;
  }
}
