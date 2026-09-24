import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFormDateComponent } from './purchase-form-date.component';

describe('PurchaseFormDateComponent', () => {
  let component: PurchaseFormDateComponent;
  let fixture: ComponentFixture<PurchaseFormDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseFormDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseFormDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
