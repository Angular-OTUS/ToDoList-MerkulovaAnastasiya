import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const trimmedMinLength = (minLength: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (typeof control.value === 'string') {
      const trimmedValue = control.value.trim();
      if (trimmedValue.length < minLength) {
        return {
          minlength: {
            requiredLength: minLength,
          },
        };
      }
    }
    return null;
  };
};
