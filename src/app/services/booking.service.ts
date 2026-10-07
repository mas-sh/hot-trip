import { Injectable, signal } from '@angular/core';
import { BookingDetails } from '../data/models/booking-details';
import { Flight } from '../data/models/flight';

/** Keeps the booking in progress while the user moves between pages. */
@Injectable({ providedIn: 'root' })
export class BookingService {
  readonly selectedFlight = signal<Flight | null>(null);
  readonly details = signal<BookingDetails | null>(null);

  selectFlight(flight: Flight): void {
    this.selectedFlight.set(flight);
  }

  setDetails(details: BookingDetails): void {
    this.details.set(details);
  }
}
