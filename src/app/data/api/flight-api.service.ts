import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SAMPLE_FLIGHTS } from '../mock/sample-flights';
import { Flight } from '../models/flight';
import { FlightSearch } from '../models/flight-search';

@Injectable({ providedIn: 'root' })
export class FlightApiService {
  searchFlights(search: FlightSearch): Observable<Flight[]> {
    // TODO: Actual API call
    return of(SAMPLE_FLIGHTS);
  }
}
