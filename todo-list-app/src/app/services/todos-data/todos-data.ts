import { Injectable } from '@angular/core';
import { AddTodoDto, EditTodoDto } from '../../shared/types/dto/todo.dto';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { generateNextId } from '../../shared/util/helpers';
import { INITIAL_TODOS } from './todo-list.config';

@Injectable({
  providedIn: 'root',
})
export class TodosDataService {
  private todos: ITodoItem[] = INITIAL_TODOS;

  public addNewTodo(newTodo: AddTodoDto): void {
    this.todos = [...this.todos, { ...newTodo, id: generateNextId(this.todos) }];
  }

  public editTodo(todo: EditTodoDto): void {
    const todoId = this.todos.findIndex((item) => item.id === todo.id);
    this.todos[todoId] = todo;
  }

  public removeTodo(id: number): void {
    this.todos = [...this.todos.filter((todo) => todo.id !== id)];
  }

  public getTodoById(id: number): ITodoItem | undefined {
    return this.todos.find((item) => item.id === id);
  }

  public getAllTodos(): ITodoItem[] {
    return this.todos;
  }
}
