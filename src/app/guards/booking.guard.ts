import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';

/** The booking page needs a selected flight; otherwise go back to the home page. */
export const bookingGuard: CanActivateFn = () => {
  const booking = inject(BookingService);
  return booking.selectedFlight() ? true : inject(Router).createUrlTree(['/']);
};
