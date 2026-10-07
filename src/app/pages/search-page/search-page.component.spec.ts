import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SearchPageComponent } from './search-page.component';
import { SAMPLE_FLIGHTS } from '../../data/mock/sample-flights';

describe('SearchPageComponent', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'search', component: SearchPageComponent }])]
    });
    harness = await RouterTestingHarness.create();
  });

  it('should show the flights for a search in the URL', async () => {
    const page = await harness.navigateByUrl('/search?from=AMS&to=LHR&departureDate=2026-10-20', SearchPageComponent);
    expect(page).toBeTruthy();
    expect(harness.routeNativeElement!.querySelectorAll('ui-flight').length).toBe(SAMPLE_FLIGHTS.length);
  });

  it('should ask for a new search when the URL has no search', async () => {
    await harness.navigateByUrl('/search');
    expect(harness.routeNativeElement!.querySelector('ui-flight')).toBeNull();
    expect(harness.routeNativeElement!.textContent).toContain('Start a new search');
  });
});
