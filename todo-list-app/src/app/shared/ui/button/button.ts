import { Component, computed, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';

type TAppButton = 'submit' | 'delete';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  public title: InputSignal<string> = input.required<string>();
  public type: InputSignal<TAppButton> = input.required<TAppButton>();
  public isDisabled: InputSignal<boolean> = input<boolean>(false);

  public action: OutputEmitterRef<Event> = output<Event>();

  public buttonClass: Signal<string> = computed(() => this.type() === 'submit' ? 'add-button' : 'delete-button');

  public handleClick(event: Event) {
    if (this.isDisabled()) return;
    this.action.emit(event);
  }
}
