import { Component } from '@angular/core';
import { ITodoItem } from './todo-item.interface';
import { INITIAL_TODOS } from './todo-list.config';
import { TodoListItem } from './todo-list-item/todo-list-item';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-todo-list',
  imports: [TodoListItem, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  public newTodoText: string = '';
  public todos: ITodoItem[] = INITIAL_TODOS;

  public get isSubmitDisabled(): boolean {
    return !this.newTodoText.trim();
  }

  public onAddInputChange(e: Event): void {
    const { value } = e.target as HTMLInputElement;
    this.newTodoText = value.trim();
  }

  public addNewTodo(e: Event): void {
    e.preventDefault();
    if (this.isSubmitDisabled) return;

    const newId = this.todos.length > 0 ? Math.max(...this.todos.map((todo) => todo.id)) + 1 : 1;

    this.todos = [...this.todos, { id: newId, text: this.newTodoText }];
    this.newTodoText = '';
  }

  public deleteTodoById(id: number): void {
    this.todos = [...this.todos.filter((todo) => todo.id !== id)];
  }
}
