import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidednavComponent } from './sidednav.component';

describe('SidednavComponent', () => {
  let component: SidednavComponent;
  let fixture: ComponentFixture<SidednavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidednavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidednavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
