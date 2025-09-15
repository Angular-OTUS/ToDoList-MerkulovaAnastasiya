import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef
} from '@angular/core';
import { Button } from '../../../shared/ui/button/button';
import { ITodoItem } from '../todo-item.interface';

@Component({
  selector: 'app-todo-list-item',
  imports: [Button],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.scss',
})
export class TodoListItem {
  public currentTodo: InputSignal<ITodoItem> = input.required<ITodoItem>();

  public removeCurrentTodo: OutputEmitterRef<number> = output<number>();

  handleRemoveTodo(id: number) {
    this.removeCurrentTodo.emit(id);
  }
}
