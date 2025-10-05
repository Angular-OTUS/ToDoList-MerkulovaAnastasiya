import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ToastService } from '../../services/toast/toast';
import { TOAST_ICONS } from '../../shared/util/constants';

@Component({
  selector: 'app-toast-container',
  imports: [MatIcon, CommonModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);
  protected readonly toastIcons = TOAST_ICONS

  protected toasts = computed(() => this.toastService.allToasts());

  protected removeToast(id: number): void {
    this.toastService.removeToast(id);
  }
}
