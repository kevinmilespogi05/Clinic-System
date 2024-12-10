import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInsuranceComponent } from './admin-insurance.component';

describe('AdminInsuranceComponent', () => {
  let component: AdminInsuranceComponent;
  let fixture: ComponentFixture<AdminInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInsuranceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
