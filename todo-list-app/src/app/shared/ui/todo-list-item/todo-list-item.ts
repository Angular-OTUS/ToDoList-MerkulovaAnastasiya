import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  Signal,
  viewChild,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TodosStore } from '../../../store/todos-store';
import { ValidatorErrMessageService } from '../../../services/validator-error-message/validator-error-message';
import { ShowTooltip } from '../../directives/show-tooltip';
import { ITodoItem } from '../../types/todo-item.interface';
import { TODO_STATUS, TOOLTIP_TEXT } from '../../util/constants';
import { trimmedMinLength } from '../../validators/trimmed-minlength.validator';
import { Button } from '../button/button';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-todo-list-item',
  imports: [
    Button,
    CommonModule,
    ShowTooltip,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    TranslocoModule,
  ],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListItem {
  private readonly formBuilder: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  protected readonly errorService: ValidatorErrMessageService = inject(ValidatorErrMessageService);
  private readonly todosStore = inject(TodosStore);

  protected TOOLTIP_TEXT = TOOLTIP_TEXT;

  public currentTodo = input.required<ITodoItem>();

  protected editTodoForm = this.formBuilder.group({
    text: this.formBuilder.control<string>('', [
      Validators.required,
      trimmedMinLength(3),
      Validators.maxLength(45),
    ]),
  });

  protected isSelected: Signal<boolean> = computed(
    () => this.todosStore.selectedItemId() === this.currentTodo().id
  );

  protected isEditing: Signal<boolean> = computed(
    () => this.todosStore.editingItemId() === this.currentTodo().id
  );

  protected isCompleted: Signal<boolean> = computed(
    () => this.currentTodo().status === TODO_STATUS.COMPLETED
  );

  private readonly editInputRef = viewChild<ElementRef<HTMLInputElement>>('editInput');

  focusEffect = effect(() => {
    if (this.isEditing() && this.editInputRef()) {
      this.editInputRef()?.nativeElement.focus();
    }
  });

  protected handleOpenEditing(e: Event) {
    e.stopPropagation();
    this.todosStore.setEditingItemId(this.currentTodo().id);
    this.editTodoForm.controls.text.setValue(this.currentTodo().text);
  }

  protected handleCloseEditing() {
    this.editTodoForm.reset();
    this.todosStore.setEditingItemId(null);
  }

  protected handleUpdateTodo(e: Event) {
    e.stopPropagation();
    if (this.editTodoForm.valid) {
      this.todosStore.updateTodo({
        ...this.currentTodo(),
        text: this.editTodoForm.controls.text.value,
      });
    }
  }

  protected handleRemoveTodo(e: Event, id: string) {
    e.stopPropagation();
    this.todosStore.deleteTodoById(id);
  }

  protected handleTodoClick(id: string) {
    this.todosStore.setSelectedItemId(id);
  }

  protected onCheckboxChange(e: MatCheckboxChange) {
    this.todosStore.updateTodo({
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

  protected shouldShowError(controlName: string): boolean {
    const control = this.editTodoForm.get(controlName);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }
}
