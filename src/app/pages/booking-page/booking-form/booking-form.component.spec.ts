import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormComponent } from './booking-form.component';
import { BookingDetails } from '../../../data/models/booking-details';

describe('BookingFormComponent', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;
  let emitted: BookingDetails[];

  const element = () => fixture.nativeElement as HTMLElement;

  const type = (label: string, value: string) => {
    const field = [...element().querySelectorAll('mat-form-field')].find((f) => f.textContent?.includes(label))!;
    const input = field.querySelector('input')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
  };

  const submit = () => {
    element().querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    emitted = [];
    component.submitted.subscribe((details) => emitted.push(details));
    fixture.detectChanges();
  });

  it('should show inline messages and not emit when empty', () => {
    submit();

    expect(emitted).toEqual([]);
    const errors = [...element().querySelectorAll('mat-error')].map((e) => e.textContent?.trim());
    expect(errors).toEqual(['Enter your full name', 'Enter your email address', 'Enter your contact number']);
  });

  it('should explain an invalid email and phone number', () => {
    type('Email', 'not-an-email');
    type('Contact number', 'abc');
    fixture.detectChanges();

    const errors = [...element().querySelectorAll('mat-error')].map((e) => e.textContent?.trim());
    expect(errors).toContain('Enter a valid email address, e.g. name@example.com');
    expect(errors).toContain('Enter a valid phone number, e.g. +31 6 1234 5678');
  });

  it('should emit the trimmed details when valid', () => {
    type('Full name', '  Jane Doe ');
    type('Email', 'jane@example.com');
    type('Contact number', '+31 6 1234 5678');
    submit();

    expect(emitted).toEqual([{ fullName: 'Jane Doe', email: 'jane@example.com', phone: '+31 6 1234 5678', passengers: 1 }]);
  });
});
