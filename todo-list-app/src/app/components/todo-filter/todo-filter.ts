import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';
import { TODO_STATUS } from '../../shared/util/constants';

interface TFilterOptions {
  label: string;
  value: string | null;
}

@Component({
  selector: 'app-todo-filter',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, TranslocoModule],
  templateUrl: './todo-filter.html',
  styleUrl: './todo-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoFilter {
  protected readonly options: TFilterOptions[] = [
    { label: 'filters.all', value: null },
    { label: 'filters.inProgress', value: TODO_STATUS.INPROGRESS },
    { label: 'filters.completed', value: TODO_STATUS.COMPLETED },
  ];
  public value = input<string | null>(null);

  protected valueChange = output<string | null>();

  protected onValueChange(newValue: string | null): void {
    this.valueChange.emit(newValue);
  }
}
