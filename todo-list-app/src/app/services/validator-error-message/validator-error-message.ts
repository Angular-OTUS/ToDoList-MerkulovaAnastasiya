import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorErrorMessage {
  public getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;
    const firstErrorKey = Object.keys(errors)[0];

    switch (firstErrorKey) {
      case 'required':
        return `${fieldName} is required.`;

      case 'minLength':
        if (errors['minLength']?.requiredLength !== undefined) {
          return `${fieldName} must be at least ${errors['minLength'].requiredLength} chars.`;
        }
        break;

      case 'maxlength':
        if (errors['maxlength']?.requiredLength !== undefined) {
          return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} chars.`;
        }
        break;

      default:
        return `${fieldName} is invalid`;
    }

    return `${fieldName} is invalid`;
  }
}
