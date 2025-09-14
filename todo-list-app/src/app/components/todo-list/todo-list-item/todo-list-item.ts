import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITodoItem } from '../todo-item.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list-item',
  imports: [],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.scss',
})
export class TodoListItem {
  @Input() public currentTodo?: ITodoItem;
  @Output() public removeCurrentTodo: EventEmitter<number> = new EventEmitter();

  handleRemoveTodo(id:number){
    this.removeCurrentTodo.emit(id)
  }
}
