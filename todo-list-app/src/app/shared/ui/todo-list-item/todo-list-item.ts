import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  Signal,
  ViewChild
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TodosStateService } from '../../../services/todos-state/todos-state';
import { ValidatorErrMessageService } from '../../../services/validator-error-message/validator-error-message';
import { ShowTooltip } from '../../directives/show-tooltip';
import { ITodoItem } from '../../types/todo-item.interface';
import { TODO_STATUS, TOOLTIP_TEXT } from '../../util/constants';
import { trimmedMinLength } from '../../validators/trimmed-minlength.validator';
import { Button } from '../button/button';

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
  ],
  templateUrl: './todo-list-item.html',
  styleUrl: './todo-list-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListItem {
  private readonly formBuilder: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  protected readonly errorService: ValidatorErrMessageService = inject(ValidatorErrMessageService);
  private readonly todosState: TodosStateService = inject(TodosStateService);

  protected TOOLTIP_TEXT = TOOLTIP_TEXT;

  public currentTodo = input.required<ITodoItem>();
  public selectedId = input<string | null>(null);
  protected editingItemId: Signal<string | null> = this.todosState.editingItemId;

  protected onDeleteSuccess = output<string>();
  protected clickCurrentTodo = output<string>();

  protected editTodoForm = this.formBuilder.group({
    text: this.formBuilder.control<string>('', [
      Validators.required,
      trimmedMinLength(3),
      Validators.maxLength(45),
    ]),
  });

  protected isSelected: Signal<boolean> = computed(
    () => this.selectedId() === this.currentTodo().id
  );

  protected isEditing: Signal<boolean> = computed(
    () => this.editingItemId() === this.currentTodo().id
  );

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
    this.todosState.toggleEditing(this.currentTodo().id);
    this.editTodoForm.controls.text.setValue(this.currentTodo().text);
  }

  protected handleCloseEditing() {
    this.editTodoForm.reset();
    this.todosState.toggleEditing(null);
  }

  protected handleUpdateTodo(e: Event) {
    e.stopPropagation();
    if (this.editTodoForm.valid) {
      this.todosState.updateTodo({
        ...this.currentTodo(),
        text: this.editTodoForm.controls.text.value,
      });
      this.handleCloseEditing();
    }
  }

  protected handleRemoveTodo(e: Event, id: string) {
    e.stopPropagation();
    this.todosState.deleteTodoById(id);
    this.onDeleteSuccess.emit(id);
  }

  protected handleTodoClick(id: string) {
    this.clickCurrentTodo.emit(id);
  }

  protected onCheckboxChange(e: MatCheckboxChange) {
    this.todosState.updateTodo({
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
