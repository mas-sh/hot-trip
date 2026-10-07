import { BookingDetails } from './booking-details';
import { Flight } from './flight';

export interface Booking {
  id: string;
  flight: Flight;
  details: BookingDetails;
}
