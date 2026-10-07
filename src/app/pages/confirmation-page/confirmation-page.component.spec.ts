import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { routes } from '../../app.routes';
import { BookingApiService } from '../../data/api/booking-api.service';
import { Booking } from '../../data/models/booking';
import { SAMPLE_FLIGHTS } from '../../data/mock/sample-flights';

describe('ConfirmationPageComponent', () => {
  const booking: Booking = {
    id: 'abc123',
    flight: SAMPLE_FLIGHTS[0],
    details: { fullName: 'Jane Doe', email: 'jane@example.com', phone: '+31 6 12345678', passengers: 2 },
  };
  let getBooking: jasmine.Spy;

  /** Opens the URL and waits until the booking has loaded. */
  const open = async (url: string) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    await harness.fixture.whenStable();
    harness.detectChanges();
    return harness;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())]
    });
    getBooking = spyOn(TestBed.inject(BookingApiService), 'getBooking').and.returnValue(of(booking));
  });

  it('should load the booking from the ID in the URL and show the summary', async () => {
    const harness = await open('/confirmation/abc123');

    expect(getBooking).toHaveBeenCalledWith('abc123');
    const text = harness.routeNativeElement!.textContent;
    expect(text).toContain('Thank you, Jane Doe!');
    expect(text).toContain('Booking reference: abc123');
    expect(text).toContain('€258.00');
  });

  it('should show a message when the booking cannot be loaded', async () => {
    getBooking.and.returnValue(throwError(() => new Error('Not found')));
    const harness = await open('/confirmation/abc123');

    expect(harness.routeNativeElement!.textContent).toContain("We couldn't load this booking.");
  });

  it('should go to the home page when the URL has no ID', async () => {
    await open('/confirmation');

    expect(TestBed.inject(Router).url).toBe('/');
  });
});
