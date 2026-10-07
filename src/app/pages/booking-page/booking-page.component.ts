import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookingApiService } from '../../data/api/booking-api.service';
import { BookingDetails } from '../../data/models/booking-details';
import { BookingService } from '../../services/booking.service';
import { LayoutWebsiteComponent } from '../../layout/layout-website/layout-website.component';
import { UiFlightComponent } from '../../ui/ui-flight/ui-flight.component';
import { BookingFormComponent } from './booking-form/booking-form.component';

const MAX_PASSENGERS = 9;

@Component({
  selector: 'booking-page',
  imports: [BookingFormComponent, LayoutWebsiteComponent, UiFlightComponent],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent {
  private readonly booking = inject(BookingService);
  private readonly bookingApi = inject(BookingApiService);
  private readonly router = inject(Router);

  // bookingGuard makes sure a flight is selected before this page opens.
  protected readonly flight = this.booking.selectedFlight;

  protected readonly maxPassengers = computed(() =>
    Math.min(MAX_PASSENGERS, this.flight()?.availableSeats ?? MAX_PASSENGERS),
  );

  protected readonly submitting = signal(false);
  protected readonly error = signal(false);

  protected onSubmit(details: BookingDetails): void {
    const flight = this.flight();
    if (!flight || this.submitting()) {
      return;
    }

    this.booking.setDetails(details);
    this.submitting.set(true);
    this.error.set(false);

    this.bookingApi.createBooking(flight.id, details).subscribe({
      next: (id) => {
        this.router.navigate(['/confirmation', id]);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set(true);
      },
    });
  }
}
