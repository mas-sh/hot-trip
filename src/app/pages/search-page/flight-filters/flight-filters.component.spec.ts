import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightFiltersComponent } from './flight-filters.component';
import { FlightSearchService } from '../../../services/flight-search.service';

describe('FlightFiltersComponent', () => {
  let component: FlightFiltersComponent;
  let fixture: ComponentFixture<FlightFiltersComponent>;
  let search: FlightSearchService;

  const element = () => fixture.nativeElement as HTMLElement;
  const resetButton = () => [...element().querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Reset');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightFiltersComponent],
      providers: [FlightSearchService]
    })
    .compileComponents();

    search = TestBed.inject(FlightSearchService);
    search.search({ from: 'AMS', to: 'LHR', departureDate: new Date('2026-10-20'), returnDate: null });
    fixture = TestBed.createComponent(FlightFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with no airline ticked and no Reset button', () => {
    const checkboxes = [...element().querySelectorAll<HTMLInputElement>('input[type=checkbox]')];
    expect(checkboxes.length).toBe(search.airlines().length);
    expect(checkboxes.some((checkbox) => checkbox.checked)).toBeFalse();
    expect(resetButton()).toBeUndefined();
  });

  it('should show Reset after ticking an airline and hide it again after resetting', () => {
    element().querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
    fixture.detectChanges();
    expect(search.selectedAirlines().size).toBe(1);
    expect(resetButton()).toBeDefined();

    resetButton()!.click();
    fixture.detectChanges();
    expect(search.selectedAirlines().size).toBe(0);
    expect(resetButton()).toBeUndefined();
  });
});
