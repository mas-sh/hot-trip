import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTextfieldComponent } from './ui-textfield.component';

describe('UiTextfieldComponent', () => {
  let component: UiTextfieldComponent;
  let fixture: ComponentFixture<UiTextfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTextfieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiTextfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
