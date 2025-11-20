import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ToastService } from '../../services/toast/toast';
import { IToast } from '../../shared/types/toast.interface';
import { TOAST_ICONS } from '../../shared/util/constants';

@Component({
  selector: 'app-toast-container',
  imports: [MatIcon, CommonModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);
  protected readonly toastIcons = TOAST_ICONS;

  protected toasts$ = this.toastService.allToasts$;

  protected removeToast(id: number): void {
    this.toastService.removeToast(id);
  }

  protected getToastClassString(toast: IToast): string {
    return `toast toast-${toast.variant}`;
  }
}
