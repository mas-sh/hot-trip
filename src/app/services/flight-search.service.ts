import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, of, switchMap, tap } from 'rxjs';
import { FlightApiService } from '../data/api/flight-api.service';
import { Airline } from '../data/models/airline';
import { Flight } from '../data/models/flight';
import { FlightSearch } from '../data/models/flight-search';
import { FlightSort } from '../data/models/flight-sort';

export type DepartureHours = [start: number, end: number];

const ALL_DAY: DepartureHours = [0, 24];

const COMPARE: Record<FlightSort, (a: Flight, b: Flight) => number> = {
  price: (a, b) => a.price.amount - b.price.amount,
  departure: (a, b) => a.departure.getTime() - b.departure.getTime(),
  duration: (a, b) => a.durationMinutes - b.durationMinutes,
};

@Injectable()
export class FlightSearchService {
  private readonly api = inject(FlightApiService);
  private readonly searches = new Subject<FlightSearch>();
  private readonly flights = signal<Flight[]>([]);

  readonly loading = signal(false);
  readonly error = signal(false);
  /** Empty means all airlines. */
  readonly selectedAirlines = signal<ReadonlySet<string>>(new Set());
  readonly departureHours = signal<DepartureHours>(ALL_DAY);
  readonly sort = signal<FlightSort>('price');

  readonly airlines = computed(() => {
    const byCode = new Map<string, Airline>();
    for (const flight of this.flights()) {
      byCode.set(flight.airline.code, flight.airline);
    }
    return [...byCode.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly hasActiveFilters = computed(() => {
    const [start, end] = this.departureHours();
    return this.selectedAirlines().size > 0 || start !== ALL_DAY[0] || end !== ALL_DAY[1];
  });

  readonly visibleFlights = computed(() => {
    const selected = this.selectedAirlines();
    const [start, end] = this.departureHours();
    return this.flights()
      .filter((flight) => selected.size === 0 || selected.has(flight.airline.code))
      .filter((flight) => {
        const minutes = flight.departure.getHours() * 60 + flight.departure.getMinutes();
        return minutes >= start * 60 && minutes <= end * 60;
      })
      .sort(COMPARE[this.sort()]);
  });

  constructor() {
    this.searches
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(false);
        }),
        // A newer search cancels the previous request.
        switchMap((search) =>
          this.api.searchFlights(search).pipe(
            catchError(() => {
              this.error.set(true);
              return of([]);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((flights) => {
        this.flights.set(flights);
        this.loading.set(false);
      });
  }

  search(search: FlightSearch): void {
    this.searches.next(search);
  }

  setAirlineSelected(code: string, selected: boolean): void {
    this.selectedAirlines.update((current) => {
      const next = new Set(current);
      selected ? next.add(code) : next.delete(code);
      return next;
    });
  }

  setDepartureHours(hours: DepartureHours): void {
    this.departureHours.set(hours);
  }

  setSort(sort: FlightSort): void {
    this.sort.set(sort);
  }

  resetFilters(): void {
    this.selectedAirlines.set(new Set());
    this.departureHours.set(ALL_DAY);
  }
}
