import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UiFormControl } from '../ui-form-control';

@Component({
  selector: 'ui-textfield',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './ui-textfield.component.html',
  styleUrl: './ui-textfield.component.scss'
})
export class UiTextfieldComponent extends UiFormControl {
  label = input<string>();
  placeholder = input('');
  type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'search'>('text');
  hint = input<string>();
  errorMessage = input<string>();
}
