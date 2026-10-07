import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchComponent } from './flight-search.component';
import { FlightSearch } from '../../../data/models/flight-search';

describe('FlightSearchComponent', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;
  let emitted: FlightSearch[];

  const departure = new Date(2026, 9, 20);
  const returnDate = new Date(2026, 9, 27);

  const element = () => fixture.nativeElement as HTMLElement;
  const form = () => component['form'];
  const fill = (values: Partial<ReturnType<typeof form>['value']>) => {
    form().patchValue(values);
    fixture.detectChanges();
  };
  const submit = () => {
    element().querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    fixture.detectChanges();
  };
  const errors = () => [...element().querySelectorAll('mat-error')].map((e) => e.textContent?.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSearchComponent);
    component = fixture.componentInstance;
    emitted = [];
    component.search.subscribe((search) => emitted.push(search));
    fixture.detectChanges();
  });

  it('should not search and show all errors when the form is empty', () => {
    submit();

    expect(emitted).toEqual([]);
    expect(errors()).toEqual([
      'Choose a departure city',
      'Choose a destination',
      'Choose a valid departure date',
      'Choose a valid return date',
    ]);
  });

  it('should emit a round trip with both dates', () => {
    fill({ from: 'AMS', to: 'LHR', departureDate: departure, returnDate });
    submit();

    expect(emitted).toEqual([{ from: 'AMS', to: 'LHR', departureDate: departure, returnDate }]);
  });

  it('should require a return date for a round trip', () => {
    fill({ from: 'AMS', to: 'LHR', departureDate: departure });
    submit();

    expect(emitted).toEqual([]);
    expect(errors()).toEqual(['Choose a valid return date']);
  });

  it('should hide and disable the return date when Round trip is unticked', () => {
    expect(element().textContent).toContain('Return date');

    element().querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
    fixture.detectChanges();

    expect(form().controls.roundTrip.value).toBeFalse();
    expect(form().controls.returnDate.disabled).toBeTrue();
    expect(element().textContent).not.toContain('Return date');
  });

  it('should emit a one-way trip without a return date, even if one was picked before', () => {
    fill({ from: 'AMS', to: 'LHR', departureDate: departure, returnDate });
    element().querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
    fixture.detectChanges();
    submit();

    expect(emitted).toEqual([{ from: 'AMS', to: 'LHR', departureDate: departure, returnDate: null }]);
  });

  it('should require the return date again when Round trip is ticked again', () => {
    const checkbox = element().querySelector<HTMLInputElement>('input[type=checkbox]')!;
    checkbox.click();
    fixture.detectChanges();
    checkbox.click();
    fixture.detectChanges();

    expect(form().controls.returnDate.enabled).toBeTrue();
    fill({ from: 'AMS', to: 'LHR', departureDate: departure, returnDate: null });
    submit();
    expect(emitted).toEqual([]);
  });
});
