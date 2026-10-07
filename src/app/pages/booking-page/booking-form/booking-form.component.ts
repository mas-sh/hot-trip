import { Component, computed, input, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BookingDetails } from '../../../data/models/booking-details';
import { UiButtonComponent } from '../../../ui/ui-button/ui-button.component';
import { UiDropdownComponent, UiDropdownOption } from '../../../ui/ui-form/ui-dropdown/ui-dropdown.component';
import { UiTextfieldComponent } from '../../../ui/ui-form/ui-textfield/ui-textfield.component';

/** Digits, spaces, brackets and dashes with an optional leading +, e.g. `+31 6 1234 5678`. */
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

/** Like `Validators.minLength`, but ignores surrounding spaces. */
function minTrimmedLength(min: number) {
  return (control: AbstractControl<string>): ValidationErrors | null =>
    control.value && control.value.trim().length < min ? { minTrimmedLength: { min } } : null;
}

@Component({
  selector: 'booking-form',
  imports: [ReactiveFormsModule, UiButtonComponent, UiDropdownComponent, UiTextfieldComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent {
  /** Usually the seats still available on the selected flight. */
  maxPassengers = input(9);
  submitted = output<BookingDetails>();

  protected readonly form = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, minTrimmedLength(2), Validators.maxLength(100)],
    }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(PHONE_PATTERN)] }),
    passengers: new FormControl<number | null>(1, Validators.required),
  });

  protected readonly passengerOptions = computed<UiDropdownOption<number>[]>(() =>
    Array.from({ length: this.maxPassengers() }, (_, i) => ({
      value: i + 1,
      label: i === 0 ? '1 passenger' : `${i + 1} passengers`,
    })),
  );

  protected fullNameError(): string {
    const errors = this.form.controls.fullName.errors;
    if (errors?.['required']) return 'Enter your full name';
    if (errors?.['maxlength']) return 'Use at most 100 characters';
    return 'Enter at least 2 characters';
  }

  protected emailError(): string {
    return this.form.controls.email.errors?.['required'] ? 'Enter your email address' : 'Enter a valid email address, e.g. name@example.com';
  }

  protected phoneError(): string {
    return this.form.controls.phone.errors?.['required'] ? 'Enter your contact number' : 'Enter a valid phone number, e.g. +31 6 1234 5678';
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, phone, passengers } = this.form.getRawValue();
    this.submitted.emit({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      passengers: passengers!,
    });
  }
}
