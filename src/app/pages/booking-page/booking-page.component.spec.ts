import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { BookingPageComponent } from './booking-page.component';
import { BookingApiService } from '../../data/api/booking-api.service';
import { BookingService } from '../../services/booking.service';
import { SAMPLE_FLIGHTS } from '../../data/mock/sample-flights';

describe('BookingPageComponent', () => {
  let component: BookingPageComponent;
  let fixture: ComponentFixture<BookingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPageComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    TestBed.inject(BookingService).selectFlight(SAMPLE_FLIGHTS[1]);
    fixture = TestBed.createComponent(BookingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show the selected flight without a Select button', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ui-flight')?.textContent).toContain(SAMPLE_FLIGHTS[1].flightNumber);
    expect(el.querySelector('.select')).toBeNull();
  });

  it('should limit passengers to the seats left', () => {
    expect(fixture.debugElement.query((de) => de.name === 'booking-form').componentInstance.maxPassengers())
      .toBe(SAMPLE_FLIGHTS[1].availableSeats);
  });

  it('should create the booking and go to its confirmation page', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const createBooking = spyOn(TestBed.inject(BookingApiService), 'createBooking').and.returnValue(of('abc123'));
    const details = { fullName: 'Jane Doe', email: 'jane@example.com', phone: '+31 6 12345678', passengers: 2 };

    fixture.debugElement.query((de) => de.name === 'booking-form').componentInstance.submitted.emit(details);

    const booking = TestBed.inject(BookingService);
    expect(createBooking).toHaveBeenCalledWith(SAMPLE_FLIGHTS[1].id, details);
    expect(booking.details()).toEqual(details);
    expect(navigate).toHaveBeenCalledWith(['/confirmation', 'abc123']);
  });
});
