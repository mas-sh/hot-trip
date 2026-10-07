import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSliderHarness } from '@angular/material/slider/testing';

import { UiRange, UiRangeSliderComponent } from './ui-range-slider.component';

@Component({
  imports: [UiRangeSliderComponent],
  template: `<ui-range-slider [min]="0" [max]="24" [formatLabel]="formatHour" [(value)]="hours" />`,
})
class HostComponent {
  hours: UiRange = [6, 18];
  formatHour = (hour: number) => `${hour}:00`;
}

describe('UiRangeSliderComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let slider: MatSliderHarness;

  const labels = () =>
    [...(fixture.nativeElement as HTMLElement).querySelectorAll('.labels span')].map((span) => span.textContent?.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    slider = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatSliderHarness);
  });

  it('should show the starting range on both handles and in the labels', async () => {
    expect(await (await slider.getStartThumb()).getValue()).toBe(6);
    expect(await (await slider.getEndThumb()).getValue()).toBe(18);
    expect(labels()).toEqual(['6:00', '18:00']);
  });

  it('should update the start of the range when the first handle moves', async () => {
    await (await slider.getStartThumb()).setValue(9);

    expect(fixture.componentInstance.hours).toEqual([9, 18]);
    expect(labels()).toEqual(['9:00', '18:00']);
  });

  it('should update the end of the range when the second handle moves', async () => {
    await (await slider.getEndThumb()).setValue(20);

    expect(fixture.componentInstance.hours).toEqual([6, 20]);
    expect(labels()).toEqual(['6:00', '20:00']);
  });

  it('should move the handles when the bound value changes', async () => {
    fixture.componentInstance.hours = [0, 24];
    fixture.detectChanges();

    expect(await (await slider.getStartThumb()).getValue()).toBe(0);
    expect(await (await slider.getEndThumb()).getValue()).toBe(24);
  });
});
