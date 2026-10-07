import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightSearch } from '../../data/models/flight-search';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  /** Emits a search from the form, as if the user pressed Search flights. */
  const search = async (value: FlightSearch) => {
    const form = fixture.debugElement.query((de) => de.componentInstance instanceof FlightSearchComponent);
    (form.componentInstance as FlightSearchComponent).search.emit(value);
    await fixture.whenStable();
    return TestBed.inject(Router).url;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideRouter([{ path: 'search', children: [] }])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to the search page with a round trip in the URL', async () => {
    const url = await search({
      from: 'AMS',
      to: 'LHR',
      departureDate: new Date(2026, 9, 20),
      returnDate: new Date(2026, 9, 27),
    });

    expect(url).toBe('/search?from=AMS&to=LHR&departureDate=2026-10-20&returnDate=2026-10-27');
  });

  it('should leave the return date out of the URL for a one-way trip', async () => {
    const url = await search({ from: 'AMS', to: 'JFK', departureDate: new Date(2026, 9, 20), returnDate: null });

    expect(url).toBe('/search?from=AMS&to=JFK&departureDate=2026-10-20');
  });

  it('should keep the local date near midnight instead of shifting it to UTC', async () => {
    // Converting with toISOString() would move one of these to a different day,
    // depending on the time zone the tests run in.
    const url = await search({
      from: 'AMS',
      to: 'LHR',
      departureDate: new Date(2026, 9, 20, 0, 30),
      returnDate: new Date(2026, 9, 27, 23, 30),
    });

    expect(url).toContain('departureDate=2026-10-20');
    expect(url).toContain('returnDate=2026-10-27');
  });
});
