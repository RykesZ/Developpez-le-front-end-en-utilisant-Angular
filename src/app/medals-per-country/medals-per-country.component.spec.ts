import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalsPerCountryComponent } from './medals-per-country.component';

describe('MedalsPerCountryComponent', () => {
  let component: MedalsPerCountryComponent;
  let fixture: ComponentFixture<MedalsPerCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedalsPerCountryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedalsPerCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
