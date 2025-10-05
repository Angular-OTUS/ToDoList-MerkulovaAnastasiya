import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ShowTooltip } from '../../shared/directives/show-tooltip';
import { Button } from '../../shared/ui/button/button';
import { TOOLTIP_TEXT } from '../../shared/util/constants';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, Button, CommonModule, ShowTooltip],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss',
})
export class TodoForm {
  protected readonly TOOLTIP_TEXT = TOOLTIP_TEXT;
  public newTodoText: ModelSignal<string> = model<string>('');
  public newTodoDescription: ModelSignal<string> = model<string>('');

  public isSubmitDisabled: InputSignal<boolean> = input<boolean>(true);

  protected addTodo: OutputEmitterRef<void> = output<void>();

  protected onSubmit(e: Event): void {
    e.preventDefault();
    this.addTodo.emit();
  }
}
