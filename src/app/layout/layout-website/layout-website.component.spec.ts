import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { LayoutWebsiteComponent } from './layout-website.component';

describe('LayoutWebsiteComponent', () => {
  let component: LayoutWebsiteComponent;
  let fixture: ComponentFixture<LayoutWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutWebsiteComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
