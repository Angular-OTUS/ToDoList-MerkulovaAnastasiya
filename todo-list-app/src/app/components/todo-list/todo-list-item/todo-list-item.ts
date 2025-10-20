import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  ViewChild,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidatorErrorMessage } from '../../../services/validator-error-message/validator-error-message';
import { ShowTooltip } from '../../../shared/directives/show-tooltip';
import { EditTodoDto } from '../../../shared/types/dto/todo.dto';
import { ITodoItem } from '../../../shared/types/todo-item.interface';
import { Button } from '../../../shared/ui/button/button';
import { TODO_STATUS, TOOLTIP_TEXT } from '../../../shared/util/constants';
import { trimmedMinLength } from '../../../shared/validators/trimmed-minlength.validator';

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
  protected readonly errorService: ValidatorErrorMessage = inject(ValidatorErrorMessage);
  protected TOOLTIP_TEXT = TOOLTIP_TEXT;

  public currentTodo: InputSignal<ITodoItem> = input.required<ITodoItem>();
  public selectedId: InputSignal<string | null> = input<string | null>(null);
  public editingId: InputSignal<string | null> = input<string | null>(null);

  protected updateCurrentTodo: OutputEmitterRef<EditTodoDto> = output<EditTodoDto>();
  protected removeCurrentTodo: OutputEmitterRef<string> = output<string>();
  protected clickCurrentTodo: OutputEmitterRef<string> = output<string>();
  protected openEditing: OutputEmitterRef<string> = output<string>();
  protected closeEditing: OutputEmitterRef<void> = output<void>();

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

  protected isEditing: Signal<boolean> = computed(() => this.editingId() === this.currentTodo().id);

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
    this.editTodoForm.controls.text.setValue(this.currentTodo().text);
  }

  protected handleCloseEditing() {
    this.editTodoForm.reset();
    this.closeEditing.emit();
  }

  protected handleUpdateTodo(e: Event) {
    e.stopPropagation();
    if (this.editTodoForm.valid) {
      this.updateCurrentTodo.emit({
        ...this.currentTodo(),
        text: this.editTodoForm.controls.text.value,
      });
      this.handleCloseEditing();
    }
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

  protected shouldShowError(controlName: string): boolean {
    const control = this.editTodoForm.get(controlName);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }
}
