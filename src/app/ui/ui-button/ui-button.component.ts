import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export type UiButtonVariant = 'text' | 'filled' | 'elevated' | 'outlined';

@Component({
  selector: 'ui-button',
  imports: [NgTemplateOutlet, MatButtonModule],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
  host: {
    '[class.full-width]': 'fullWidth()'
  }
})
export class UiButtonComponent {
  variant = input<UiButtonVariant>('filled');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  fullWidth = input(false);
}
