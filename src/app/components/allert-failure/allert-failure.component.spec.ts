import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllertFailureComponent } from './allert-failure.component';

describe('AllertFailureComponent', () => {
  let component: AllertFailureComponent;
  let fixture: ComponentFixture<AllertFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllertFailureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllertFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
