import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllertLoadingComponent } from './allert-loading.component';

describe('AllertLoadingComponent', () => {
  let component: AllertLoadingComponent;
  let fixture: ComponentFixture<AllertLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllertLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllertLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
