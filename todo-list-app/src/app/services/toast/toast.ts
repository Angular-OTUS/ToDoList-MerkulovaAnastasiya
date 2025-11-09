import { computed, Injectable, signal } from '@angular/core';
import { AddToastDto } from '../../shared/types/dto/toast.dto';
import { IToast } from '../../shared/types/toast.interface';
import { generateNextId } from '../../shared/util/helpers';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private timeouts = new Map<number, number>();

  private toastsSubject = new BehaviorSubject<IToast[]>([]);
  public allToasts$ = this.toastsSubject.asObservable();

  public getToasts (){
    return this.toastsSubject.getValue();
  }

  public addToast(newToast: AddToastDto) {
    const currentToasts = this.getToasts()
    const newId = generateNextId(currentToasts);

    this.toastsSubject.next([...currentToasts, { ...newToast, id: newId }]);
    const timeoutId = setTimeout(() => this.removeToast(newId), 5000);
    this.timeouts.set(newId, timeoutId);
  }

  public removeToast(id: number) {
    const currentToasts = this.getToasts()
    const timeoutId = this.timeouts.get(id);

    this.toastsSubject.next(currentToasts.filter((toast) => toast.id !== id));

    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(id);
    }
  }
}
