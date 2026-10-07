import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { UiCheckboxComponent } from './ui-checkbox.component';

@Component({
  imports: [FormsModule, UiCheckboxComponent],
  template: `<ui-checkbox [(ngModel)]="checked">Label</ui-checkbox>`,
})
class NgModelHostComponent {
  checked = false;
}

describe('UiCheckboxComponent', () => {
  let component: UiCheckboxComponent;
  let fixture: ComponentFixture<UiCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update an ngModel binding when clicked', async () => {
    const host = TestBed.createComponent(NgModelHostComponent);
    host.detectChanges();
    await host.whenStable();

    (host.nativeElement as HTMLElement).querySelector('input')!.click();
    host.detectChanges();

    expect(host.componentInstance.checked).toBeTrue();
  });

  it('should show the value written through ngModel', async () => {
    const host = TestBed.createComponent(NgModelHostComponent);
    host.componentInstance.checked = true;
    host.detectChanges();
    await host.whenStable();
    host.detectChanges();

    expect((host.nativeElement as HTMLElement).querySelector('input')!.checked).toBeTrue();
  });
});
