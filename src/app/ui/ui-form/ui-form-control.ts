import { Directive, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

/**
 * Base for form wrappers around Material controls.
 *
 * The wrapper registers itself as a no-op value accessor and hands the parent's
 * FormControl straight to the inner Material control. That way validation,
 * disabled state and <mat-error> all work as if the Material control was used directly.
 * Works with `formControlName`, `[formControl]` and `[(ngModel)]`.
 */
@Directive()
export abstract class UiFormControl implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly standaloneControl = new FormControl();

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected get control(): FormControl {
    return (this.ngControl?.control as FormControl) ?? this.standaloneControl;
  }

  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}
}
