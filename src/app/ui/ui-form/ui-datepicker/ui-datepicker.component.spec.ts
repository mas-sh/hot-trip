import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiDatepickerComponent } from './ui-datepicker.component';

@Component({
  imports: [ReactiveFormsModule, UiDatepickerComponent],
  template: `<ui-datepicker [formControl]="date" [futureOnly]="true" />`,
})
class HostComponent {
  date = new FormControl<Date | null>(null);
}

describe('UiDatepickerComponent', () => {
  let component: UiDatepickerComponent;
  let fixture: ComponentFixture<UiDatepickerComponent>;

  const daysFromToday = (days: number) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date;
  };
  const minDate = () => component['minDate']();
  const set = (inputs: { futureOnly?: boolean; min?: Date | null }) => {
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDatepickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have no minimum by default', () => {
    expect(minDate()).toBeNull();
  });

  it('should use the given min date when futureOnly is off, even in the past', () => {
    set({ min: daysFromToday(-3) });
    expect(minDate()).toEqual(daysFromToday(-3));
  });

  it('should start at today when futureOnly is on', () => {
    set({ futureOnly: true });
    expect(minDate()).toEqual(daysFromToday(0));
  });

  it('should use a later min date over today when futureOnly is on', () => {
    set({ futureOnly: true, min: daysFromToday(5) });
    expect(minDate()).toEqual(daysFromToday(5));
  });

  it('should ignore an earlier min date and use today when futureOnly is on', () => {
    set({ futureOnly: true, min: daysFromToday(-5) });
    expect(minDate()).toEqual(daysFromToday(0));
  });

  describe('in a form with futureOnly', () => {
    let host: ComponentFixture<HostComponent>;

    beforeEach(() => {
      host = TestBed.createComponent(HostComponent);
      host.detectChanges();
    });

    it('should mark a past date as invalid', () => {
      host.componentInstance.date.setValue(daysFromToday(-1));
      expect(host.componentInstance.date.hasError('matDatepickerMin')).toBeTrue();
    });

    it('should accept today and later dates', () => {
      host.componentInstance.date.setValue(daysFromToday(0));
      expect(host.componentInstance.date.valid).toBeTrue();

      host.componentInstance.date.setValue(daysFromToday(30));
      expect(host.componentInstance.date.valid).toBeTrue();
    });
  });
});
