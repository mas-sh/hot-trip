import { Component, computed, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UiFormControl } from '../ui-form-control';

@Component({
  selector: 'ui-datepicker',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './ui-datepicker.component.html',
  styleUrl: './ui-datepicker.component.scss'
})
export class UiDatepickerComponent extends UiFormControl {
  label = input<string>();
  placeholder = input('');
  hint = input<string>();
  errorMessage = input<string>();
  /** Only allow today and later dates. */
  futureOnly = input(false);
  min = input<Date | null>(null);
  max = input<Date | null>(null);

  protected readonly minDate = computed(() => {
    const min = this.min();
    if (!this.futureOnly()) {
      return min;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return min && min > today ? min : today;
  });
}
