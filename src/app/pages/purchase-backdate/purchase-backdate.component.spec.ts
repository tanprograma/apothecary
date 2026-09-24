import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBackdateComponent } from './purchase-backdate.component';

describe('PurchaseBackdateComponent', () => {
  let component: PurchaseBackdateComponent;
  let fixture: ComponentFixture<PurchaseBackdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseBackdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseBackdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
