import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { ShowTooltip } from '../../../shared/directives/show-tooltip';
import { ITodoItem } from '../../../shared/types/todo-item.interface';
import { Button } from '../../../shared/ui/button/button';
import { TOOLTIP_TEXT } from '../../../shared/util/constants';

@Component({
  selector: 'app-todo-list-item',
  imports: [Button, CommonModule, ShowTooltip],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.scss',
})
export class TodoListItem {
  protected TOOLTIP_TEXT = TOOLTIP_TEXT;
  public currentTodo: InputSignal<ITodoItem> = input.required<ITodoItem>();
  public selectedId: InputSignal<number | null> = input<number | null>(null);

  public removeCurrentTodo: OutputEmitterRef<number> = output<number>();
  public clickCurrentTodo: OutputEmitterRef<number> = output<number>();

  public isSelected: Signal<boolean> = computed(() => this.selectedId() === this.currentTodo().id);

  public handleRemoveTodo(id: number) {
    this.removeCurrentTodo.emit(id);
  }

  public handleTodoClick(id: number) {
    this.clickCurrentTodo.emit(id);
  }
}
