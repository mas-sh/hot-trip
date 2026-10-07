import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UiFormControl } from '../ui-form-control';

@Component({
  selector: 'ui-checkbox',
  imports: [ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './ui-checkbox.component.html',
  styleUrl: './ui-checkbox.component.scss'
})
export class UiCheckboxComponent extends UiFormControl {}
