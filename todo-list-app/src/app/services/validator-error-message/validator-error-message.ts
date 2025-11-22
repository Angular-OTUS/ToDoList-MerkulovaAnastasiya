import { inject, Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class ValidatorErrMessageService {
  private translocoService = inject(TranslocoService);

  public showErrorMessage(control: AbstractControl | null): boolean {
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  public getErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;
    const firstErrorKey = Object.keys(errors)[0];
    const keyPrefix = 'validation.';

    switch (firstErrorKey) {
      case 'required':
        return this.translocoService.translate(keyPrefix + 'required', { fieldName });

      case 'minlength':
        const requiredMinLength = errors['minlength']?.requiredLength;
        if (requiredMinLength !== undefined) {
          return this.translocoService.translate(keyPrefix + 'minLength', {
            fieldName,
            requiredLength: requiredMinLength,
          });
        }
        break;

      case 'maxlength':
        const requiredMaxLength = errors['maxlength']?.requiredLength;
        if (requiredMaxLength !== undefined) {
          return this.translocoService.translate(keyPrefix + 'maxLength', {
            fieldName,
            requiredLength: requiredMaxLength,
          });
        }
        break;

      default:
        return this.translocoService.translate(keyPrefix + 'genericInvalid', { fieldName });
    }

    return this.translocoService.translate(keyPrefix + 'genericInvalid', { fieldName });
  }
}
