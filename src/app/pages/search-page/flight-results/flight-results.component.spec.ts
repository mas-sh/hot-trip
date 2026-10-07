import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { FlightResultsComponent } from './flight-results.component';
import { BookingService } from '../../../services/booking.service';
import { FlightSearchService } from '../../../services/flight-search.service';

describe('FlightResultsComponent', () => {
  let component: FlightResultsComponent;
  let fixture: ComponentFixture<FlightResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightResultsComponent],
      providers: [FlightSearchService, provideRouter([])]
    })
    .compileComponents();

    TestBed.inject(FlightSearchService).search({
      from: 'AMS',
      to: 'LHR',
      departureDate: new Date('2026-10-20'),
      returnDate: null,
    });
    fixture = TestBed.createComponent(FlightResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store the selected flight and go to the booking page', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const firstFlight = TestBed.inject(FlightSearchService).visibleFlights()[0];

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.select')!.click();

    expect(TestBed.inject(BookingService).selectedFlight()).toBe(firstFlight);
    expect(navigate).toHaveBeenCalledWith(['/booking']);
  });
});
