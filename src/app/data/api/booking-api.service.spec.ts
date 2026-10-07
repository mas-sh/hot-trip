import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { BookingApiService } from './booking-api.service';
import { BookingDetails } from '../models/booking-details';
import { SAMPLE_FLIGHTS } from '../mock/sample-flights';

describe('BookingApiService', () => {
  let service: BookingApiService;
  const details: BookingDetails = { fullName: 'Jane Doe', email: 'jane@example.com', phone: '+31 6 12345678', passengers: 2 };

  beforeEach(() => {
    localStorage.removeItem('hot-trip.mock-bookings');
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingApiService);
  });

  afterEach(() => localStorage.removeItem('hot-trip.mock-bookings'));

  it('should return a different long ID for each booking', async () => {
    const first = await firstValueFrom(service.createBooking('f1', details));
    const second = await firstValueFrom(service.createBooking('f1', details));
    expect(first).toMatch(/^[0-9a-f]{32}$/);
    expect(second).not.toBe(first);
  });

  it('should return a created booking as it was entered', async () => {
    const id = await firstValueFrom(service.createBooking(SAMPLE_FLIGHTS[4].id, details));
    const booking = await firstValueFrom(service.getBooking(id));
    expect(booking).toEqual({ id, flight: SAMPLE_FLIGHTS[4], details });
  });

  it('should keep created bookings across service instances, like after a refresh', async () => {
    const id = await firstValueFrom(service.createBooking(SAMPLE_FLIGHTS[4].id, details));
    const booking = await firstValueFrom(new BookingApiService().getBooking(id));
    expect(booking.details).toEqual(details);
  });

  it('should return the same example booking for an unknown ID every time', async () => {
    const first = await firstValueFrom(service.getBooking('some-unknown-id'));
    const second = await firstValueFrom(service.getBooking('some-unknown-id'));
    expect(first).toEqual(second);
    expect(first.id).toBe('some-unknown-id');
  });
});
