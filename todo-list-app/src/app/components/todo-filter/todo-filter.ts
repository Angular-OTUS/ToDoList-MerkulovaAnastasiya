import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DEFAULT_FILTER_STATUS, TODO_STATUS } from '../../shared/util/constants';

type TFilterOptions = {
  label: string;
  value: string | null;
};

@Component({
  selector: 'app-todo-filter',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './todo-filter.html',
  styleUrl: './todo-filter.scss',
})
export class TodoFilter {
  protected readonly options: TFilterOptions[] = [
    { label: DEFAULT_FILTER_STATUS, value: null },
    { label: TODO_STATUS.INPROGRESS, value: TODO_STATUS.INPROGRESS },
    { label: TODO_STATUS.COMPLETED, value: TODO_STATUS.COMPLETED },
  ];
  public value: InputSignal<string | null> = input<string | null>(null);

  protected valueChange: OutputEmitterRef<string | null> = output<string | null>();

  protected onValueChange(newValue: string | null): void {
    this.valueChange.emit(newValue);
  }
}
