import { Injectable } from '@angular/core';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { AddTodoDto, EditTodoDto } from '../../shared/types/todo.dto';
import { generateTodoId } from '../../shared/util/helpers';
import { INITIAL_TODOS } from './todo-list.config';

@Injectable({
  providedIn: 'root',
})
export class TodosDataService {
  private todos: ITodoItem[] = INITIAL_TODOS;

  public addNewTodo(newTodo: AddTodoDto): void {
    this.todos = [...this.todos, { ...newTodo, id: generateTodoId(this.todos) }];
  }

  public editTodo(todo: EditTodoDto): void {
    const todoId = this.todos.findIndex((item) => item.id === todo.id);
    this.todos[todoId] = todo;
  }

  public removeTodo(id: number): void {
    const newTodos = [...this.todos.filter((todo) => todo.id !== id)];
    this.todos = newTodos;
  }

  public getTodoById(id: number): ITodoItem | undefined {
    return this.todos.find((item) => item.id === id);
  }

  public getAllTodos(): ITodoItem[] {
    return this.todos;
  }
}
