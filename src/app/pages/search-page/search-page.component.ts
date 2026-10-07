import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { FlightFiltersComponent } from './flight-filters/flight-filters.component';
import { FlightResultsComponent } from './flight-results/flight-results.component';
import { FlightSearch } from '../../data/models/flight-search';
import { FlightSearchService } from '../../services/flight-search.service';
import { LayoutWebsiteComponent } from '../../layout/layout-website/layout-website.component';

@Component({
  selector: 'search-page',
  imports: [
    FlightFiltersComponent,
    FlightResultsComponent,
    LayoutWebsiteComponent,
    RouterLink,
  ],
  providers: [FlightSearchService],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  private readonly results = inject(FlightSearchService);

  protected readonly hasSearch = signal(false);

  constructor() {
    inject(ActivatedRoute)
      .queryParamMap.pipe(map(toFlightSearch), takeUntilDestroyed())
      .subscribe((search) => {
        this.hasSearch.set(search !== null);
        if (search) {
          this.results.search(search);
        }
      });
  }
}

/** Reads the params written by the home page, e.g. `?from=AMS&to=LHR&departureDate=2026-10-20`. */
function toFlightSearch(params: ParamMap): FlightSearch | null {
  const from = params.get('from');
  const to = params.get('to');
  const departureDate = parseDateParam(params.get('departureDate'));
  if (!from || !to || !departureDate) {
    return null;
  }
  return { from, to, departureDate, returnDate: parseDateParam(params.get('returnDate')) };
}

/** Parses `yyyy-MM-dd` as a local date. `new Date('2026-10-20')` would be UTC midnight. */
function parseDateParam(value: string | null): Date | null {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return isNaN(date.getTime()) ? null : date;
}
