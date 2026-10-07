import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';

import { BookingPageComponent } from './booking-page.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingApiService } from '../../data/api/booking-api.service';
import { BookingDetails } from '../../data/models/booking-details';
import { BookingService } from '../../services/booking.service';
import { SAMPLE_FLIGHTS } from '../../data/mock/sample-flights';

describe('BookingPageComponent', () => {
  let component: BookingPageComponent;
  let fixture: ComponentFixture<BookingPageComponent>;
  let navigate: jasmine.Spy;
  let createBooking: jasmine.Spy;

  const details: BookingDetails = { fullName: 'Jane Doe', email: 'jane@example.com', phone: '+31 6 12345678', passengers: 2 };
  const errorText = 'Something went wrong while creating your booking.';

  const bookingForm = () =>
    fixture.debugElement.query((de) => de.componentInstance instanceof BookingFormComponent)
      .componentInstance as BookingFormComponent;
  const submitForm = () => {
    bookingForm().submitted.emit(details);
    fixture.detectChanges();
  };
  const text = () => (fixture.nativeElement as HTMLElement).textContent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPageComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    TestBed.inject(BookingService).selectFlight(SAMPLE_FLIGHTS[1]);
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    createBooking = spyOn(TestBed.inject(BookingApiService), 'createBooking').and.returnValue(of('abc123'));
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
    expect(bookingForm().maxPassengers()).toBe(SAMPLE_FLIGHTS[1].availableSeats);
  });

  it('should create the booking and go to its confirmation page', () => {
    submitForm();

    expect(createBooking).toHaveBeenCalledWith(SAMPLE_FLIGHTS[1].id, details);
    expect(TestBed.inject(BookingService).details()).toEqual(details);
    expect(navigate).toHaveBeenCalledWith(['/confirmation', 'abc123']);
    expect(text()).not.toContain(errorText);
  });

  it('should show an error and stay on the page when the booking fails', () => {
    createBooking.and.returnValue(throwError(() => new Error('Server error')));

    submitForm();

    expect(text()).toContain(errorText);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should let the user try again after a failure, and clear the error on success', () => {
    createBooking.and.returnValue(throwError(() => new Error('Server error')));
    submitForm();

    createBooking.and.returnValue(of('abc123'));
    submitForm();

    expect(createBooking).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenCalledWith(['/confirmation', 'abc123']);
    expect(text()).not.toContain(errorText);
  });

  it('should ignore extra submits while the booking is being created', () => {
    const response = new Subject<string>();
    createBooking.and.returnValue(response);

    submitForm();
    submitForm();
    expect(createBooking).toHaveBeenCalledTimes(1);

    response.next('abc123');
    expect(navigate).toHaveBeenCalledOnceWith(['/confirmation', 'abc123']);
  });
});
