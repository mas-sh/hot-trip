import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SAMPLE_FLIGHTS } from '../mock/sample-flights';
import { Booking } from '../models/booking';
import { BookingDetails } from '../models/booking-details';

/** What the mock "server" keeps per booking. */
interface StoredBooking {
  flightId: string;
  details: BookingDetails;
}

const STORAGE_KEY = 'hot-trip.mock-bookings';

@Injectable({ providedIn: 'root' })
export class BookingApiService {
  /** Creates a booking and returns its ID. */
  createBooking(flightId: string, details: BookingDetails): Observable<string> {
    const id = randomId();
    writeStore({ ...readStore(), [id]: { flightId, details } });
    return of(id);
  }

  /**
   * Returns the booking with this ID. Bookings made in this browser come back as
   * entered; any other ID gets example data derived from the ID, so the same ID
   * always returns the same booking.
   */
  getBooking(id: string): Observable<Booking> {
    const stored = readStore()[id] ?? exampleBooking(id);
    const flight = SAMPLE_FLIGHTS.find((f) => f.id === stored.flightId) ?? SAMPLE_FLIGHTS[0];
    return of({ id, flight, details: stored.details });
  }
}

/** 32 random hex characters, e.g. `9f86d081884c7d659a2feaa0c55ad015`. */
function randomId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function exampleBooking(id: string): StoredBooking {
  const hash = [...id].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
  const bookable = SAMPLE_FLIGHTS.filter((flight) => flight.availableSeats > 0);
  const flight = bookable[hash % bookable.length];
  return {
    flightId: flight.id,
    details: {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '+31 6 1234 5678',
      passengers: Math.min((hash % 3) + 1, flight.availableSeats),
    },
  };
}

function readStore(): Record<string, StoredBooking> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, StoredBooking>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore, see readStore.
  }
}
