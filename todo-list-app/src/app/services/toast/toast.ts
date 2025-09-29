import { computed, Injectable, signal } from '@angular/core';
import { AddToastDto } from '../../shared/types/dto/toast.dto';
import { IToast } from '../../shared/types/toast.interface';
import { generateNextId } from '../../shared/util/helpers';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<IToast[]>([]);
  private timeouts = new Map<number, number>();

  public allToasts = computed(() => this.toasts());

  public addToast(newToast: AddToastDto) {
    const newId = generateNextId(this.toasts());

    this.toasts.update((currentToasts) => [...currentToasts, { ...newToast, id: newId }]);

    const timeoutId = setTimeout(() => this.removeToast(newId), 5000);
    this.timeouts.set(newId, timeoutId);
  }

  public removeToast(id: number) {
    const timeoutId = this.timeouts.get(id);

    this.toasts.update((currentToasts) => currentToasts.filter((toast) => toast.id !== id));

    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(id);
    }
  }
}
