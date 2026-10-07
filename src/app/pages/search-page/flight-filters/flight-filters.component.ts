import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightSearchService } from '../../../services/flight-search.service';
import { UiButtonComponent } from '../../../ui/ui-button/ui-button.component';
import { UiCheckboxComponent } from '../../../ui/ui-form/ui-checkbox/ui-checkbox.component';
import { UiRangeSliderComponent } from '../../../ui/ui-form/ui-range-slider/ui-range-slider.component';

@Component({
  selector: 'flight-filters',
  imports: [FormsModule, UiButtonComponent, UiCheckboxComponent, UiRangeSliderComponent],
  templateUrl: './flight-filters.component.html',
  styleUrl: './flight-filters.component.scss'
})
export class FlightFiltersComponent {
  protected readonly results = inject(FlightSearchService);

  protected readonly formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`;
}
