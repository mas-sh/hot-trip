import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';

import { bookingGuard } from './booking.guard';
import { BookingService } from '../services/booking.service';
import { SAMPLE_FLIGHTS } from '../data/mock/sample-flights';

describe('bookingGuard', () => {
  const run = () =>
    TestBed.runInInjectionContext(() => bookingGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('should send the user home when no flight is selected', () => {
    expect(TestBed.inject(Router).serializeUrl(run() as UrlTree)).toBe('/');
  });

  it('should allow the booking page once a flight is selected', () => {
    TestBed.inject(BookingService).selectFlight(SAMPLE_FLIGHTS[0]);
    expect(run()).toBeTrue();
  });
});
