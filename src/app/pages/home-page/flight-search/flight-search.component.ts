import { Component, effect, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightSearch } from '../../../data/models/flight-search';
import { SAMPLE_CITIES } from '../../../data/mock/sample-cities';
import { UiButtonComponent } from '../../../ui/ui-button/ui-button.component';
import { UiCheckboxComponent } from '../../../ui/ui-form/ui-checkbox/ui-checkbox.component';
import { UiDatepickerComponent } from '../../../ui/ui-form/ui-datepicker/ui-datepicker.component';
import { UiDropdownComponent, UiDropdownOption } from '../../../ui/ui-form/ui-dropdown/ui-dropdown.component';

@Component({
  selector: 'flight-search',
  imports: [
    ReactiveFormsModule,
    UiButtonComponent,
    UiCheckboxComponent,
    UiDatepickerComponent,
    UiDropdownComponent,
  ],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.scss'
})
export class FlightSearchComponent {
  /** Emits when the form is submitted with valid values. */
  search = output<FlightSearch>();

  protected readonly cities: UiDropdownOption<string>[] = SAMPLE_CITIES.map((city) => ({
    value: city.code,
    label: city.name,
  }));

  protected readonly form = new FormGroup({
    from: new FormControl<string | null>(null, Validators.required),
    to: new FormControl<string | null>(null, Validators.required),
    departureDate: new FormControl<Date | null>(null, Validators.required),
    returnDate: new FormControl<Date | null>(null, Validators.required),
    roundTrip: new FormControl(true, { nonNullable: true }),
  });

  protected readonly roundTrip = toSignal(this.form.controls.roundTrip.valueChanges, {
    initialValue: this.form.controls.roundTrip.value,
  });

  protected readonly departureDate = toSignal(this.form.controls.departureDate.valueChanges, {
    initialValue: this.form.controls.departureDate.value,
  });

  constructor() {
    // A disabled control is skipped by validation and left out of form.value,
    // so one-way trips don't require a return date.
    effect(() => {
      const returnDate = this.form.controls.returnDate;
      this.roundTrip() ? returnDate.enable() : returnDate.disable();
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // The form is valid here, so the required fields are filled in.
    const { from, to, departureDate, returnDate, roundTrip } = this.form.getRawValue();
    this.search.emit({
      from: from!,
      to: to!,
      departureDate: departureDate!,
      returnDate: roundTrip ? returnDate : null,
    });
  }
}
