import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Flight } from '../../../data/models/flight';
import { FlightSort } from '../../../data/models/flight-sort';
import { BookingService } from '../../../services/booking.service';
import { FlightSearchService } from '../../../services/flight-search.service';
import { UiFlightComponent } from '../../../ui/ui-flight/ui-flight.component';
import { UiDropdownComponent, UiDropdownOption } from '../../../ui/ui-form/ui-dropdown/ui-dropdown.component';

@Component({
  selector: 'flight-results',
  imports: [FormsModule, UiDropdownComponent, UiFlightComponent],
  templateUrl: './flight-results.component.html',
  styleUrl: './flight-results.component.scss'
})
export class FlightResultsComponent {
  protected readonly results = inject(FlightSearchService);
  private readonly booking = inject(BookingService);
  private readonly router = inject(Router);

  protected readonly sortOptions: UiDropdownOption<FlightSort>[] = [
    { value: 'price', label: 'Lowest price' },
    { value: 'departure', label: 'Earliest departure' },
    { value: 'duration', label: 'Shortest duration' },
  ];

  protected selectFlight(flight: Flight): void {
    this.booking.selectFlight(flight);
    this.router.navigate(['/booking']);
  }
}
