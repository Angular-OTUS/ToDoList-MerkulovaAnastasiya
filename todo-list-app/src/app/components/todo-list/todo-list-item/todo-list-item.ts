import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ShowTooltip } from '../../../shared/directives/show-tooltip';
import { EditTodoDto } from '../../../shared/types/dto/todo.dto';
import { ITodoItem } from '../../../shared/types/todo-item.interface';
import { Button } from '../../../shared/ui/button/button';
import { TOOLTIP_TEXT } from '../../../shared/util/constants';

@Component({
  selector: 'app-todo-list-item',
  imports: [Button, CommonModule, ShowTooltip, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.scss',
})
export class TodoListItem {
  protected TOOLTIP_TEXT = TOOLTIP_TEXT;

  public currentTodo: InputSignal<ITodoItem> = input.required<ITodoItem>();
  public selectedId: InputSignal<number | null> = input<number | null>(null);
  public editingId: InputSignal<number | null> = input<number | null>(null);

  public updateCurrentTodo: OutputEmitterRef<EditTodoDto> = output<EditTodoDto>();
  public removeCurrentTodo: OutputEmitterRef<number> = output<number>();
  public clickCurrentTodo: OutputEmitterRef<number> = output<number>();
  public openEditing: OutputEmitterRef<number> = output<number>();
  public closeEditing: OutputEmitterRef<void> = output<void>();

  public newTitle: WritableSignal<string> = signal<string>('');
  public isSelected: Signal<boolean> = computed(() => this.selectedId() === this.currentTodo().id);
  public isEditing: Signal<boolean> = computed(() => this.editingId() === this.currentTodo().id);
  public isSubmitDisabled: Signal<boolean> = computed(() => !this.newTitle().trim());

  @ViewChild('editInput') set editInputRef(ref: ElementRef<HTMLInputElement>) {
    if (ref && this.isEditing()) {
      ref.nativeElement.focus();
    }
  }

  public handleOpenEditing(e: Event) {
    e.stopPropagation();
    this.openEditing.emit(this.currentTodo().id);
    this.newTitle.set(this.currentTodo().text);
  }

  public handleCloseEditing() {
    this.newTitle.set('');
    this.closeEditing.emit();
  }

  public handleUpdateTodo(e: Event) {
    e.stopPropagation();
    this.updateCurrentTodo.emit({ ...this.currentTodo(), text: this.newTitle() });
    this.handleCloseEditing();
  }

  public handleRemoveTodo(e: Event, id: number) {
    e.stopPropagation();
    this.removeCurrentTodo.emit(id);
  }

  public handleTodoClick(id: number) {
    this.clickCurrentTodo.emit(id);
  }

  public handleKeydownPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        this.handleUpdateTodo(event);
        break;
      case 'Escape':
        this.handleCloseEditing();
        break;
      default:
        break;
    }
  }
}
