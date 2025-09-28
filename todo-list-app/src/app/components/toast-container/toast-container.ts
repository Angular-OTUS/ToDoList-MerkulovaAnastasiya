import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../services/toast/toast';
import { MatIcon } from '@angular/material/icon';
import { IToast } from '../../shared/types/toast.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  imports: [MatIcon, CommonModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainer {
  private toastService = inject(ToastService);
  protected readonly toastIcons = {
    error: 'error',
    success: 'check_circle',
  };

  protected toasts = computed(() => this.toastService.allToasts());

  protected removeToast(id: number): void {
    this.toastService.removeToast(id);
  }
}
