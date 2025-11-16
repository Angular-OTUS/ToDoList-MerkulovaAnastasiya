import { ChangeDetectionStrategy, Component, computed, input, output, Signal } from '@angular/core';

type TAppButton = 'submit' | 'delete';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  public type = input.required<TAppButton>();
  public isDisabled = input<boolean>(false);

  public action = output<Event>();

  public buttonClass: Signal<string> = computed(() =>
    this.type() === 'submit' ? 'add-button' : 'delete-button',
  );

  public handleClick(event: Event) {
    if (this.isDisabled()) return;
    this.action.emit(event);
  }
}
