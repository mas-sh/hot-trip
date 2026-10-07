import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFlightComponent } from './ui-flight.component';
import { SAMPLE_FLIGHTS } from '../../data/mock/sample-flights';

describe('UiFlightComponent', () => {
  let component: UiFlightComponent;
  let fixture: ComponentFixture<UiFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiFlightComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('flight', SAMPLE_FLIGHTS[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the route, duration and price', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('KL1001');
    expect(text).toContain('08:30');
    expect(text).toContain('1h 20m');
    expect(text).toContain('€129.00');
    expect(text).toContain('42 seats left');
  });

  it('should mark an overnight arrival and a sold-out flight', () => {
    fixture.componentRef.setInput('flight', SAMPLE_FLIGHTS[2]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.day-offset')?.textContent).toContain('+1');
    expect(el.textContent).toContain('Sold out');
    expect(el.querySelector<HTMLButtonElement>('.select')!.disabled).toBeTrue();
  });

  it('should emit the flight when Select is clicked', () => {
    let selected: unknown;
    component.selected.subscribe((flight) => (selected = flight));

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.select')!.click();

    expect(selected).toBe(SAMPLE_FLIGHTS[0]);
  });
});
