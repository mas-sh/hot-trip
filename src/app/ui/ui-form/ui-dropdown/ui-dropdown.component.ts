import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UiFormControl } from '../ui-form-control';

export interface UiDropdownOption<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ui-dropdown',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './ui-dropdown.component.html',
  styleUrl: './ui-dropdown.component.scss'
})
export class UiDropdownComponent extends UiFormControl {
  label = input<string>();
  placeholder = input('');
  options = input<UiDropdownOption[]>([]);
  hint = input<string>();
  errorMessage = input<string>();
}
