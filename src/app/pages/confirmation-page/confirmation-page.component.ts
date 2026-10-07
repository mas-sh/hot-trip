import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { BookingApiService } from '../../data/api/booking-api.service';
import { LayoutWebsiteComponent } from '../../layout/layout-website/layout-website.component';
import { UiFlightComponent } from '../../ui/ui-flight/ui-flight.component';

@Component({
  selector: 'confirmation-page',
  imports: [CurrencyPipe, LayoutWebsiteComponent, RouterLink, UiFlightComponent],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './confirmation-page.component.scss'
})
export class ConfirmationPageComponent {
  private readonly bookingApi = inject(BookingApiService);

  /** From the `:id` route parameter. */
  id = input.required<string>();

  /** Loads the booking for the ID, and again whenever the ID changes. */
  protected readonly booking = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) => this.bookingApi.getBooking(id),
  });

  protected readonly totalPrice = computed(() => {
    const booking = this.booking.value();
    return booking ? booking.flight.price.amount * booking.details.passengers : 0;
  });
}
