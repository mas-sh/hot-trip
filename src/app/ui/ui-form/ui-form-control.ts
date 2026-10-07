import { DestroyRef, Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NgControl, NgModel } from '@angular/forms';

/**
 * Base for form wrappers around Material controls.
 *
 * The wrapper registers itself as a value accessor and hands the parent's
 * FormControl straight to the inner Material control. That way validation,
 * disabled state and <mat-error> all work as if the Material control was used directly.
 * Works with `formControlName`, `[formControl]` and `[(ngModel)]`.
 */
@Directive()
export abstract class UiFormControl implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private readonly standaloneControl = new FormControl();
  private lastValue: unknown;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected get control(): FormControl {
    return (this.ngControl?.control as FormControl) ?? this.standaloneControl;
  }

  writeValue(value: unknown): void {
    this.lastValue = value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    // Reactive forms read the shared control directly. NgModel only emits
    // ngModelChange through this callback, so forward the user's changes to it.
    if (!(this.ngControl instanceof NgModel)) {
      return;
    }
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value !== this.lastValue) {
        this.lastValue = value;
        fn(value);
      }
    });
  }

  registerOnTouched(): void {}
}
