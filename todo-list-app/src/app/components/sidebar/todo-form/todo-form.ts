import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidatorErrMessageService } from '../../../services/validator-error-message/validator-error-message';
import { ShowTooltip } from '../../../shared/directives/show-tooltip';
import { Button } from '../../../shared/ui/button/button';
import { TOOLTIP_TEXT } from '../../../shared/util/constants';
import { trimmedMinLength } from '../../../shared/validators/trimmed-minlength.validator';
import { TodosStore } from '../../../store/todos-store';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-todo-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    Button,
    CommonModule,
    ShowTooltip,
    ReactiveFormsModule,
    TranslocoModule,
  ],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
  private readonly formBuilder: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly todosStore = inject(TodosStore);
  protected readonly errorService: ValidatorErrMessageService = inject(ValidatorErrMessageService);
  protected readonly TOOLTIP_TEXT = TOOLTIP_TEXT;
  protected newTodoForm = this.formBuilder.group({
    text: this.formBuilder.control<string>('', [
      Validators.required,
      trimmedMinLength(3),
      Validators.maxLength(45),
    ]),
    description: this.formBuilder.control<string>('', [
      Validators.required,
      trimmedMinLength(3),
      Validators.maxLength(255),
    ]),
  });

  protected onSubmit(e: Event): void {
    e.preventDefault();
    this.newTodoForm.markAllAsTouched();
    if (this.newTodoForm.valid) {
      this.todosStore.addNewTodo(this.newTodoForm.getRawValue());
      this.newTodoForm.reset();
    }
  }
}
