import { Component, input, model } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

export type UiRange = [start: number, end: number];

@Component({
  selector: 'ui-range-slider',
  imports: [MatSliderModule],
  templateUrl: './ui-range-slider.component.html',
  styleUrl: './ui-range-slider.component.scss'
})
export class UiRangeSliderComponent {
  value = model<UiRange>([0, 100]);
  min = input(0);
  max = input(100);
  step = input(1);
  formatLabel = input<(value: number) => string>((value) => `${value}`);

  protected setStart(start: number): void {
    this.value.update(([, end]) => [start, end]);
  }

  protected setEnd(end: number): void {
    this.value.update(([start]) => [start, end]);
  }
}
