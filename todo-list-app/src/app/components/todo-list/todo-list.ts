import { Component } from '@angular/core';
import { TTodoItem } from './todo-item.type';
import { INITIAL_TODOS } from './todo-list.config';

@Component({
  selector: 'app-todo-list',
  imports: [],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss'
})
export class TodoList {
  protected todos: TTodoItem[] = INITIAL_TODOS;
}
