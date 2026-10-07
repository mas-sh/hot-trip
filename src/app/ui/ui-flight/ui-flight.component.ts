import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Flight } from '../../data/models/flight';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: 'ui-flight',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './ui-flight.component.html',
  styleUrl: './ui-flight.component.scss'
})
export class UiFlightComponent {
  flight = input.required<Flight>();
  /** Shows the Select button. */
  selectable = input(true);
  selected = output<Flight>();

  protected readonly duration = computed(() => {
    const minutes = this.flight().durationMinutes;
    const hours = Math.floor(minutes / 60);
    return hours ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  });

  /** Days between departure and arrival date, e.g. 1 for an overnight flight. */
  protected readonly arrivalDayOffset = computed(() => {
    const { departure, arrival } = this.flight();
    const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return Math.round((startOfDay(arrival) - startOfDay(departure)) / MS_PER_DAY);
  });
}
