export interface FlightSearch {
  from: string;
  to: string;
  departureDate: Date;
  returnDate: Date | null;
}
