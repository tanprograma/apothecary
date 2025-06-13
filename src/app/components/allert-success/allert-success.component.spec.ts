import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllertSuccessComponent } from './allert-success.component';

describe('AllertSuccessComponent', () => {
  let component: AllertSuccessComponent;
  let fixture: ComponentFixture<AllertSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllertSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllertSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
