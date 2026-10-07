import { TestBed } from '@angular/core/testing';

import { FlightApiService } from './flight-api.service';
import { SAMPLE_FLIGHTS } from '../mock/sample-flights';
import { FlightSearch } from '../models/flight-search';

describe('FlightApiService', () => {
  let service: FlightApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightApiService);
  });

  it('should return the sample flights for a search', (done) => {
    const search: FlightSearch = {
      from: 'AMS',
      to: 'LHR',
      departureDate: new Date('2026-10-20'),
      returnDate: null,
    };

    service.searchFlights(search).subscribe((flights) => {
      expect(flights).toEqual(SAMPLE_FLIGHTS);
      done();
    });
  });
});
