import { Airline } from './airline';
import { Price } from './price';

export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  from: string;
  to: string;
  departure: Date;
  arrival: Date;
  durationMinutes: number;
  price: Price;
  availableSeats: number;
}
