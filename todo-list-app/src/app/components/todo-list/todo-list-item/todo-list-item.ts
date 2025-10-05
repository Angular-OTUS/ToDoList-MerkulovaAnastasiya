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
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ShowTooltip } from '../../../shared/directives/show-tooltip';
import { EditTodoDto } from '../../../shared/types/dto/todo.dto';
import { ITodoItem } from '../../../shared/types/todo-item.interface';
import { Button } from '../../../shared/ui/button/button';
import { TODO_STATUS, TOOLTIP_TEXT } from '../../../shared/util/constants';

@Component({
  selector: 'app-todo-list-item',
  imports: [
    Button,
    CommonModule,
    ShowTooltip,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.scss',
})
export class TodoListItem {
  protected TOOLTIP_TEXT = TOOLTIP_TEXT;

  public currentTodo: InputSignal<ITodoItem> = input.required<ITodoItem>();
  public selectedId: InputSignal<string | null> = input<string | null>(null);
  public editingId: InputSignal<string | null> = input<string | null>(null);

  protected updateCurrentTodo: OutputEmitterRef<EditTodoDto> = output<EditTodoDto>();
  protected removeCurrentTodo: OutputEmitterRef<string> = output<string>();
  protected clickCurrentTodo: OutputEmitterRef<string> = output<string>();
  protected openEditing: OutputEmitterRef<string> = output<string>();
  protected closeEditing: OutputEmitterRef<void> = output<void>();

  protected newTitle: WritableSignal<string> = signal<string>('');
  protected isSelected: Signal<boolean> = computed(() => this.selectedId() === this.currentTodo().id);
  protected isEditing: Signal<boolean> = computed(() => this.editingId() === this.currentTodo().id);
  protected isSubmitDisabled: Signal<boolean> = computed(() => !this.newTitle().trim());
  protected isCompleted: Signal<boolean> = computed(
    () => this.currentTodo().status === TODO_STATUS.COMPLETED
  );
  @ViewChild('editInput') set editInputRef(ref: ElementRef<HTMLInputElement>) {
    if (ref && this.isEditing()) {
      ref.nativeElement.focus();
    }
  }

  protected handleOpenEditing(e: Event) {
    e.stopPropagation();
    this.openEditing.emit(this.currentTodo().id);
    this.newTitle.set(this.currentTodo().text);
  }

  protected handleCloseEditing() {
    this.newTitle.set('');
    this.closeEditing.emit();
  }

  protected handleUpdateTodo(e: Event) {
    e.stopPropagation();
    this.updateCurrentTodo.emit({ ...this.currentTodo(), text: this.newTitle() });
    this.handleCloseEditing();
  }

  protected handleRemoveTodo(e: Event, id: string) {
    e.stopPropagation();
    this.removeCurrentTodo.emit(id);
  }

  protected handleTodoClick(id: string) {
    this.clickCurrentTodo.emit(id);
  }

  protected onCheckboxChange(e: MatCheckboxChange) {
    this.updateCurrentTodo.emit({
      ...this.currentTodo(),
      status: e.checked ? TODO_STATUS.COMPLETED : TODO_STATUS.INPROGRESS,
    });
  }

  protected handleKeydownPress(event: KeyboardEvent) {
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
