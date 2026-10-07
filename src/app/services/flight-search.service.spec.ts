import { TestBed } from '@angular/core/testing';

import { FlightSearchService } from './flight-search.service';
import { SAMPLE_FLIGHTS } from '../data/mock/sample-flights';
import { Flight } from '../data/models/flight';

describe('FlightSearchService', () => {
  let service: FlightSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FlightSearchService] });
    service = TestBed.inject(FlightSearchService);
    service.search({ from: 'AMS', to: 'LHR', departureDate: new Date('2026-10-20'), returnDate: null });
  });

  const isSortedBy = (flights: Flight[], key: (flight: Flight) => number) =>
    flights.every((flight, i) => i === 0 || key(flights[i - 1]) <= key(flight));

  it('should load all flights sorted by price', () => {
    expect(service.loading()).toBeFalse();
    expect(service.visibleFlights().length).toBe(SAMPLE_FLIGHTS.length);
    expect(isSortedBy(service.visibleFlights(), (flight) => flight.price.amount)).toBeTrue();
  });

  it('should list each airline once, by name', () => {
    const names = service.airlines().map((airline) => airline.name);
    const uniqueCodes = new Set(SAMPLE_FLIGHTS.map((flight) => flight.airline.code));
    expect(names.length).toBe(uniqueCodes.size);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('should change the sort', () => {
    service.setSort('departure');
    expect(isSortedBy(service.visibleFlights(), (flight) => flight.departure.getTime())).toBeTrue();

    service.setSort('duration');
    expect(isSortedBy(service.visibleFlights(), (flight) => flight.durationMinutes)).toBeTrue();
  });

  it('should show only the selected airlines', () => {
    service.setAirlineSelected('KL', true);
    service.setAirlineSelected('BA', true);
    const codes = new Set(service.visibleFlights().map((flight) => flight.airline.code));
    expect(codes).toEqual(new Set(['KL', 'BA']));
  });

  it('should show all airlines again when none is selected', () => {
    service.setAirlineSelected('KL', true);
    service.setAirlineSelected('KL', false);
    expect(service.visibleFlights().length).toBe(SAMPLE_FLIGHTS.length);
  });

  it('should filter by departure time', () => {
    service.setDepartureHours([12, 18]);
    expect(service.visibleFlights().length).toBeGreaterThan(0);
    for (const flight of service.visibleFlights()) {
      expect(flight.departure.getHours()).toBeGreaterThanOrEqual(12);
      expect(flight.departure.getHours()).toBeLessThan(18);
    }
  });

  it('should report active filters until they are reset', () => {
    expect(service.hasActiveFilters()).toBeFalse();

    service.setAirlineSelected('KL', true);
    expect(service.hasActiveFilters()).toBeTrue();

    service.setAirlineSelected('KL', false);
    service.setDepartureHours([12, 18]);
    expect(service.hasActiveFilters()).toBeTrue();

    service.setAirlineSelected('KL', true);
    service.resetFilters();
    expect(service.hasActiveFilters()).toBeFalse();
    expect(service.visibleFlights().length).toBe(SAMPLE_FLIGHTS.length);
  });
});
